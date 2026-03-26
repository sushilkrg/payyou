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

  // get sender wallet
  const senderWallet = await prisma.wallet.findUnique({
    where: { userId: senderUserId },
  });

  if (!senderWallet) throw new Error("WALLET_NOT_FOUND");
  if (senderWallet.status === "FROZEN") throw new Error("WALLET_FROZEN");

  // check sufficient balance
  if (Number(senderWallet.balance) < amount) {
    throw new Error("INSUFFICIENT_BALANCE");
  }

  //check daily limit by - sum all successfull SEND transactions from today
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

  // get recipient

  const recipient = await prisma.user.findUnique({
    where: { username: recipientUsername },
    include: { wallet: true },
  });

  if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");
  if (recipient.id === senderUserId) throw new Error("SELF_TRANSFER");
  if (!recipient.wallet) throw new Error("RECIPIENT_WALLET_NOT_FOUND");
  if (recipient.wallet.status === "FROZEN")
    throw new Error("RECIPIENT_WALLET_FROZEN");

  // execute atomic prisma transaction
  const result = await prisma.$transaction(async (tx) => {
    // create the SEND transaction record (sender's perspective)
    const sendTransaction = await tx.transaction.create({
      data: {
        senderWalletId: senderWallet.id,
        receiverWalletId: recipient.wallet!.id,
        amount,
        type: TransactionType.SEND,
        status: TransactionStatus.SUCCESS,
        note,
      },
    });

    // create the RECEIVE transaction record (recipient's perspective)
    // both points to same wallet but from different perspective
    const receiveTransaction = await tx.transaction.create({
      data: {
        senderWalletId: senderWallet.id,
        receiverWalletId: recipient.wallet!.id,
        amount,
        type: TransactionType.RECEIVE,
        status: TransactionStatus.SUCCESS,
        note,
      },
    });

    // create DEBIT ledger entry for sender
    await tx.ledgerEntry.create({
      data: {
        transactionId: sendTransaction.id,
        walletId: senderWallet.id,
        entryType: EntryType.DEBIT,
        amount,
      },
    });
    // create CREDIT ledger entry for recipient
    await tx.ledgerEntry.create({
      data: {
        transactionId: receiveTransaction.id,
        walletId: recipient.wallet!.id,
        entryType: EntryType.CREDIT,
        amount,
      },
    });

    // deduct from sender's balance
    await tx.wallet.update({
      where: { id: senderWallet.id },
      data: { balance: { decrement: amount } },
    });

    // add to recipient's balance
    await tx.wallet.update({
      where: { id: recipient.wallet!.id },
      data: { balance: { increment: amount } },
    });

    return { transactionId: sendTransaction.id };
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

  // get the user's wallet first
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error("WALLET_NOT_FOUND");

  const pageNum = Number(page) || 1;
const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limit;

  // Build dynamic where clause based on query params
  // We fetch transactions where this wallet is either sender OR receiver
  const where = {
    OR: [{ senderWalletId: wallet.id }, { receiverWalletId: wallet.id }],
    // Spread type/status filters only if provided
    ...(type && { type: type as TransactionType }),
    ...(status && { status: status as TransactionStatus }),
  };

  // Run count + data queries in parallel for efficiency
  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: limitNum,
      include: {
        // Include wallet owner details for display
        senderWallet: {
          include: { user: { select: { fullName: true, username: true } } },
        },
        receiverWallet: {
          include: { user: { select: { fullName: true, username: true } } },
        },
      },
    }),
  ]);

  // Shape the response — add direction field (IN/OUT) for UI display
  const shaped = transactions.map((tx) => ({
    id: tx.id,
    amount: Number(tx.amount),
    type: tx.type,
    status: tx.status,
    note: tx.note,
    createdAt: tx.createdAt,
    direction: tx.receiverWalletId === wallet.id ? "IN" : "OUT",
    sender: {
      fullName: tx.senderWallet.user.fullName,
      username: tx.senderWallet.user.username,
    },
    receiver: {
      fullName: tx.receiverWallet.user.fullName,
      username: tx.receiverWallet.user.username,
    },
  }));

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
