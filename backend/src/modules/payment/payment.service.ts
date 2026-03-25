import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { redis } from "../../lib/redis";
import { TransactionType, TransactionStatus, EntryType } from "@prisma/client";
import { CreatePaymentIntentInput } from "./payment.schema";

// ─── CREATE PAYMENT INTENT ────────────────────────────────
//
// A PaymentIntent represents one payment attempt in Stripe.
// We create it on our backend (never frontend) so we control the amount.
// The clientSecret returned is safe to send to frontend —
// it only allows confirming THIS specific payment, nothing else.

export const createPaymentIntentService = async (
  userId: string,
  data: CreatePaymentIntentInput,
) => {
  const { amount } = data;

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("WALLET_NOT_FOUND");
  if (wallet.status === "FROZEN") throw new Error("WALLET_FROZEN");

  // Idempotency key — prevents duplicate PaymentIntents if user
  // clicks "Add Money" multiple times in the same minute
  const minute = Math.floor(Date.now() / 60000);
  const idempotencyKey = `payment:${userId}:${amount}:${minute}`;

  const existingIntentId = await redis.get(idempotencyKey);
  if (existingIntentId) {
    const existingIntent = await stripe.paymentIntents.retrieve(
      String(existingIntentId),
    );
    return {
      clientSecret: existingIntent.client_secret,
      paymentIntentId: existingIntent.id,
    };
  }

  // Stripe amounts are in smallest currency unit
  // INR: ₹100 = 10000 paise (multiply by 100)
  const amountInPaise = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: "inr",
    metadata: {
      userId,
      walletId: wallet.id,
      originalAmount: amount.toString(),
    },
    automatic_payment_methods: { enabled: true },
  });

  // Cache PaymentIntent ID for idempotency (TTL: 2 minutes)
  await redis.set(idempotencyKey, paymentIntent.id, { ex: 120 });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

// ─── HANDLE WEBHOOK ───────────────────────────────────────
//
// Stripe sends this when payment status changes.
// Raw body (Buffer) is required for signature verification —
// this is why we use express.raw() on the webhook route specifically.

export const handleWebhookService = async (
  rawBody: Buffer,
  signature: string,
) => {
  let event: import("stripe").Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    throw new Error("INVALID_WEBHOOK_SIGNATURE");
  }

  if (event.type !== "payment_intent.succeeded") {
    return { received: true };
  }

  const paymentIntent = event.data
    .object as import("stripe").Stripe.PaymentIntent;
  const { userId, walletId, originalAmount } = paymentIntent.metadata;
  const amount = parseFloat(originalAmount);

  // Idempotency check — Stripe delivers webhooks at least once,
  // meaning the same event can fire multiple times.
  // We use Redis to track processed webhooks and skip duplicates.
  const webhookKey = `webhook:processed:${paymentIntent.id}`;
  const alreadyProcessed = await redis.get(webhookKey);
  if (alreadyProcessed) {
    return { received: true, duplicate: true };
  }

  // Atomic DB update — wallet credit + ledger entry together
  await prisma.$transaction(async (tx) => {
    // For ADD transactions, sender and receiver wallet are the same
    const transaction = await tx.transaction.create({
      data: {
        senderWalletId: walletId,
        receiverWalletId: walletId,
        amount,
        type: TransactionType.ADD,
        status: TransactionStatus.SUCCESS,
        note: `Added via Stripe (${paymentIntent.id})`,
      },
    });

    await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId,
        entryType: EntryType.CREDIT,
        amount,
      },
    });

    await tx.wallet.update({
      where: { id: walletId },
      data: { balance: { increment: amount } },
    });
  });

  // Mark as processed — TTL 24h covers Stripe's full retry window
  await redis.set(webhookKey, "1", { ex: 24 * 60 * 60 });

  return { received: true };
};

// ─── GET PAYMENT STATUS ───────────────────────────────────

export const getPaymentStatusService = async (
  paymentIntentId: string,
  userId: string,
) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Security: ensure this PaymentIntent belongs to the authenticated user
  if (paymentIntent.metadata.userId !== userId) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    status: paymentIntent.status,
    amount: parseFloat(paymentIntent.metadata.originalAmount),
  };
};
