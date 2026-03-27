import { EntryType, TransactionStatus, TransactionType } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { SendMoneyInput, TransactionQuery } from "./transaction.schema";

// check recipient username
export const checkRecipientService = async (
  username: string,
  senderUserId: string,
) => {
  const recipient = await prisma.user.findUnique({
    where: { username },
    select: { id: true, fullName: true, username: true },
  });

  if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");

  // prevent self transfer
  if (recipient.id === senderUserId) throw new Error("SELF_TRANSFER");

  return { fullName: recipient.fullName, username: recipient.username };
};

// send money
export const sendMoneyService = async (
  senderUserId: string,
  data: SendMoneyInput,
) => {
  const { recipientUsername, amount, note } = data;

  const senderWallet = await prisma.wallet.findUnique({
    where: { userId: senderUserId },
  });
  if (!senderWallet) throw new Error("WALLET_NOT_FOUND");
  if (senderWallet.status === "FROZEN") throw new Error("WALLET_FROZEN");

  if (Number(senderWallet.balance) < amount) {
    throw new Error("INSUFFICIENT_BALANCE");
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaySpentResult = await prisma.transaction.aggregate({
    where: {
      senderWalletId: senderWallet.id,
      type: TransactionType.SEND,
      status: TransactionStatus.SUCCESS,
      createdAt: { gte: startOfDay },
    },
    _sum: { amount: true },
  });

  const todaySpent = Number(todaySpentResult._sum.amount ?? 0);
  if (todaySpent + amount > Number(senderWallet.dailyLimit)) {
    throw new Error("DAILY_LIMIT_EXCEEDED");
  }

  const recipient = await prisma.user.findUnique({
    where: { username: recipientUsername },
    include: { wallet: true },
  });
  if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");
  if (recipient.id === senderUserId) throw new Error("SELF_TRANSFER");
  if (!recipient.wallet) throw new Error("RECIPIENT_WALLET_NOT_FOUND");
  if (recipient.wallet.status === "FROZEN")
    throw new Error("RECIPIENT_WALLET_FROZEN");

  const result = await prisma.$transaction(async (tx) => {
    // ── ONE transaction record per transfer ───────────────
    // type = SEND from sender's perspective
    // The receiver sees it as RECEIVE via the direction field
    // (receiverWalletId === their walletId → direction: "IN")
    const transaction = await tx.transaction.create({
      data: {
        senderWalletId: senderWallet.id,
        receiverWalletId: recipient.wallet!.id,
        amount,
        type: TransactionType.SEND, // ← only SEND, no separate RECEIVE record
        status: TransactionStatus.SUCCESS,
        note,
      },
    });

    // DEBIT entry for sender
    await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId: senderWallet.id,
        entryType: EntryType.DEBIT,
        amount,
      },
    });

    // CREDIT entry for recipient
    await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId: recipient.wallet!.id,
        entryType: EntryType.CREDIT,
        amount,
      },
    });

    // Deduct from sender
    await tx.wallet.update({
      where: { id: senderWallet.id },
      data: { balance: { decrement: amount } },
    });

    // Add to recipient
    await tx.wallet.update({
      where: { id: recipient.wallet!.id },
      data: { balance: { increment: amount } },
    });

    return { transactionId: transaction.id };
  });

  return {
    transactionId: result.transactionId,
    amount,
    recipient: {
      fullName: recipient.fullName,
      username: recipient.username,
    },
  };
};

// get transaction history
export const getTransactionsService = async (
  userId: string,
  query: TransactionQuery,
) => {
  const { type, status, page = 1, limit = 10 } = query;

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("WALLET_NOT_FOUND");

  const skip = (page - 1) * limit;

  const where = {
    // ── Fetch transactions where this wallet is sender OR receiver ──
    OR: [{ senderWalletId: wallet.id }, { receiverWalletId: wallet.id }],
    ...(type && { type: type as TransactionType }),
    ...(status && { status: status as TransactionStatus }),
  };

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        senderWallet: {
          include: {
            user: { select: { fullName: true, username: true } },
          },
        },
        receiverWallet: {
          include: {
            user: { select: { fullName: true, username: true } },
          },
        },
      },
    }),
  ]);

  const shaped = transactions.map((tx) => {
    // direction: "IN"  → money coming into this wallet (receiver)
    // direction: "OUT" → money going out of this wallet (sender)
    // ADD type is always "IN" — wallet is both sender and receiver
    const direction =
      tx.type === "ADD"
        ? "IN"
        : tx.receiverWalletId === wallet.id
          ? "IN"
          : "OUT";

    return {
      id: tx.id,
      amount: Number(tx.amount),
      type: tx.type,
      status: tx.status,
      note: tx.note,
      direction,
      createdAt: tx.createdAt,
      sender: {
        fullName: tx.senderWallet.user.fullName,
        username: tx.senderWallet.user.username,
      },
      receiver: {
        fullName: tx.receiverWallet.user.fullName,
        username: tx.receiverWallet.user.username,
      },
    };
  });

  return {
    transactions: shaped,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};
