import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { handleStripeWebhook } from "./controllers/transactionController.js";
import Stripe from "stripe";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 8000;

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.set("trust proxy", 1);

// Global IP based rate limiter
app.use(apiLimiter);

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/payment", paymentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
});
