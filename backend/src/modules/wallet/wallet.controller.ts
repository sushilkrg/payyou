import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { getWalletService } from "./wallet.service";

const handleError = (res: Response, err: unknown): void => {
  const message = err instanceof Error ? err.message : "INTERNAL_ERROR";
  const errorMap: Record<string, { status: number; message: string }> = {
    WALLET_NOT_FOUND: { status: 404, message: "Wallet not found" },
    WALLET_FROZEN: {
      status: 403,
      message: "Your wallet is frozen. Contact support.",
    },
  };

  const mapped = errorMap[message];
  if (mapped) {
    res.status(mapped.status).json({ success: false, message: mapped.message });
  } else {
    console.error("Wallet error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getWallet = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await getWalletService(req.userId!);
    res.status(200).json({ success: true, wallet: result });
  } catch (err) {
    handleError(res, err);
  }
};
