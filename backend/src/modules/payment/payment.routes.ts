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

router.post(
  "/create-intent",
  authMiddleware,
  validate(createPaymentIntentSchema),
  createPaymentIntent,
);

router.get("/status/:paymentIntentId", authMiddleware, getPaymentStatus);

export default router;
