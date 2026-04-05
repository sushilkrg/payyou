import e, { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { chatService } from "./chatbot.service";
import { success } from "zod";

const handleError = (res: Response, err: unknown): void => {
  const message = err instanceof Error ? err.message : "INTERNAL_ERROR";

  // Rate limit error has format "RATE_LIMIT:ttl_seconds"
  if (message.startsWith("RATE_LIMIT:")) {
    const ttl = message.split(":")[1];
    res.status(429).json({
      success: false,
      message: `Too many messages. Try again in ${ttl} seconds.`,
      retryAfter: Number(ttl),
    });
    return;
  }

  console.error("Chatbot error:", err);
  res.status(500).json({ success: false, message: "Chatbot unavailable" });
};

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await chatService(req.userId!, req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};
