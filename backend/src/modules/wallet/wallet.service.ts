import { prisma } from "../../lib/prisma";

export const getWalletService = async (userId: string) => {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) throw new Error("WALLET_NOT_FOUND");
  if (wallet.status === "FROZEN") throw new Error("WALLET_FROZEN");

  // calculate how much user has already spent today
  // look at all SEND transactions from today that were SUCCESSFUL
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaySpentResult = await prisma.transaction.aggregate({
    where: {
      senderWalletId: wallet.id,
      type: "SEND",
      status: "SUCCESS",
      createdAt: { gte: startOfDay },
    },
    _sum: { amount: true },
  });

  const todaySpent = todaySpentResult._sum.amount ?? 0;
  const remainingLimit = Number(wallet.dailyLimit) - Number(todaySpent);

  return {
    id: wallet.id,
    balance: Number(wallet.balance),
    dailyLimit: Number(wallet.dailyLimit),
    todaySpent: Number(todaySpent),
    remainingLimit: remainingLimit < 0 ? 0 : remainingLimit,
    status: wallet.status,
  };
};
