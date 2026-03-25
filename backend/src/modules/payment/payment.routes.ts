import { Router } from "express";
import express from "express";
import {
  createPaymentIntent,
  stripeWebhook,
  getPaymentStatus,
} from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createPaymentIntentSchema } from "./payment.schema";

const router = Router();

// CRITICAL: Webhook MUST use express.raw() — NOT express.json()
// Stripe signature verification requires the raw unmodified Buffer.
// If express.json() runs first, the Buffer is gone and verification fails.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

router.post(
  "/create-intent",
  authMiddleware,
  validate(createPaymentIntentSchema),
  createPaymentIntent,
);

router.get("/status/:paymentIntentId", authMiddleware, getPaymentStatus);

export default router;
