import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { redis } from "../../lib/redis";
import { TransactionType, TransactionStatus, EntryType } from "@prisma/client";
import { CreatePaymentIntentInput } from "./payment.schema";

// ─── CREATE PAYMENT INTENT ────────────────────────────────

export const createPaymentIntentService = async (
  userId: string,
  data: CreatePaymentIntentInput,
) => {
  if (!data || data.amount === undefined) throw new Error("INVALID_INPUT");

  const { amount } = data;

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("WALLET_NOT_FOUND");
  if (wallet.status === "FROZEN") throw new Error("WALLET_FROZEN");

  // Fetch user details — needed for Indian export compliance
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fullName: true, email: true },
  });
  if (!user) throw new Error("USER_NOT_FOUND");

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

  const amountInPaise = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaise,
    currency: "inr",
    description: "Wallet top-up via PayYou",
    statement_descriptor: "PAYYOU WALLET",

    // Required by Stripe for Indian merchant accounts (RBI export regulations)
    // Customer name and address must be provided on every INR PaymentIntent
    shipping: {
      name: user.fullName,
      address: {
        line1: "India",
        city: "India",
        state: "India",
        postal_code: "000000",
        country: "IN",
      },
    },

    metadata: {
      userId,
      walletId: wallet.id,
      originalAmount: amount.toString(),
    },
    automatic_payment_methods: { enabled: true },
  });

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

//  GET PAYMENT STATUS

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
