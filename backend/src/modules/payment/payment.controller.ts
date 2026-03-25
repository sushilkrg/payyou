import { Request, Response } from "express";
import {
  createPaymentIntentService,
  handleWebhookService,
  getPaymentStatusService,
} from "./payment.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

const handleError = (res: Response, err: unknown): void => {
  const message = err instanceof Error ? err.message : "INTERNAL_ERROR";
  const errorMap: Record<string, { status: number; message: string }> = {
    WALLET_NOT_FOUND: { status: 404, message: "Wallet not found" },
    WALLET_FROZEN: { status: 403, message: "Your wallet is frozen" },
    INVALID_WEBHOOK_SIGNATURE: {
      status: 400,
      message: "Invalid webhook signature",
    },
    UNAUTHORIZED: { status: 403, message: "Unauthorized" },
  };

  const mapped = errorMap[message];
  if (mapped) {
    res.status(mapped.status).json({ success: false, message: mapped.message });
  } else {
    console.error("Payment error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createPaymentIntent = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await createPaymentIntentService(req.userId!, req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

// Webhook: req.body is raw Buffer here — NOT parsed JSON
// express.raw() is applied on this route specifically
export const stripeWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const signature = req.headers["stripe-signature"] as string;
    if (!signature) {
      res
        .status(400)
        .json({ success: false, message: "Missing stripe-signature header" });
      return;
    }
    const result = await handleWebhookService(req.body as Buffer, signature);
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

export const getPaymentStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { paymentIntentId } = req.params as { paymentIntentId: string };
    const result = await getPaymentStatusService(paymentIntentId, req.userId!);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};
