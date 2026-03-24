import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  checkRecipientService,
  getTransactionsService,
  sendMoneyService,
} from "./transaction.service";
import { transactionQuerySchema } from "./transaction.schema";

const handleError = (res: Response, err: unknown): void => {
  const message = err instanceof Error ? err.message : "INTERNAL_ERROR";
  const errorMap: Record<string, { status: number; message: string }> = {
    WALLET_NOT_FOUND: { status: 404, message: "Wallet not found" },
    WALLET_FROZEN: { status: 403, message: "Your wallet is frozen" },
    INSUFFICIENT_BALANCE: { status: 400, message: "Insufficient balance" },
    DAILY_LIMIT_EXCEEDED: {
      status: 400,
      message: "Daily transfer limit exceeded",
    },
    RECIPIENT_NOT_FOUND: { status: 404, message: "Recipient not found" },
    RECIPIENT_WALLET_NOT_FOUND: {
      status: 404,
      message: "Recipient wallet not found",
    },
    RECIPIENT_WALLET_FROZEN: {
      status: 403,
      message: "Recipient wallet is frozen",
    },
    SELF_TRANSFER: { status: 400, message: "Cannot send money to yourself" },
  };

  const mapped = errorMap[message];
  if (mapped) {
    res.status(mapped.status).json({ success: false, message: mapped.message });
  } else {
    console.error("Transaction error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// check recipient username
export const checkRecipient = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { username } = req.query as { username: string };
    if (!username) {
      res.status(400).json({ success: false, message: "Username required" });
      return;
    }
    const result = await checkRecipientService(username, req.userId!);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

export const sendMoney = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await sendMoneyService(req.userId!, req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

// get transaction history
export const getTransactions = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Validate and parse query params with Zod
    const query = transactionQuerySchema.parse(req.query);
    const result = await getTransactionsService(req.userId!, query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};
