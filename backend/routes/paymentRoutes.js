import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createAddMoneySession,
  getStripeTransactions,
  handleStripeWebhook,
  verifySession,
} from "../controllers/transactionController.js";

const router = express.Router();

// Create checkout session for adding money
router.post("/add-money", isAuthenticated, createAddMoneySession);

// Stripe webhook (no auth, raw body)
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   handleStripeWebhook
// );

// Verify payment session
router.get("/verify-session/:sessionId", isAuthenticated, verifySession);

// Get Stripe transaction history
router.get("/stripe-transactions", isAuthenticated, getStripeTransactions);

export default router;
