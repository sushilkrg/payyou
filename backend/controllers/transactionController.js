import mongoose from "mongoose";
import Transaction from "../models/Transaction.model.js";
import Stripe from "stripe";
import StripeTransaction from "../models/StripeTransaction.model.js";
// import StripeTransaction from "../models/StripeTransaction.js";
// import Transaction from "../models/Transaction.model.js";
import User from "../models/User.model.js";
import { stripe } from "../index.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Check if key exists before initializing
// console.log("stripe secret key -", process.env.STRIPE_SECRET_KEY);

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2025-10-29.clover",
// });

export const getMyTransactions = async (req, res) => {
  try {
    // optional filter
    const { type } = req.query;

    const query = { user: req.user._id };
    if (type) {
      query.type = type; // 'add', 'send', 'receive'
    }

    const walletId = req.user.walletId;
    const transactions = await Transaction.aggregate([
      //  Match only transactions where the logged-in user is involved
      {
        $match: {
          $or: [
            { type: "send", fromWallet: walletId },
            { type: "receive", toWallet: walletId },
            { type: "add", toWallet: walletId },
          ],
        },
      },

      { $sort: { createdAt: -1 } },
      { $limit: 100 },

      // Lookup fromUser
      {
        $lookup: {
          from: "users",
          localField: "fromWallet",
          foreignField: "walletId",
          as: "fromUser",
        },
      },
      {
        $unwind: {
          path: "$fromUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      //  Lookup toUser
      {
        $lookup: {
          from: "users",
          localField: "toWallet",
          foreignField: "walletId",
          as: "toUser",
        },
      },
      {
        $unwind: {
          path: "$toUser",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Final fields to return
      {
        $project: {
          type: 1,
          amount: 1,
          status: 1,
          createdAt: 1,
          fromWallet: 1,
          toWallet: 1,
          fromName: "$fromUser.name",
          toName: "$toUser.name",
        },
      },
    ]);

    res.status(200).json({ transactions });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getWeeklyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6); // last 7 days

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startOfWeek, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // sort by date ascending
      },
    ]);

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create Checkout Session for Adding Money
export const createAddMoneySession = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;
    const walletId = req.user.walletId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Add Money to Wallet",
              description: `Add ₹${amount} to your wallet`,
            },
            unit_amount: Math.round(amount * 100), // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        userId: userId.toString(),
        walletId,
        amount: amount.toString(),
        type: "add_money",
      },
      customer_email: req.user.email,
      // -------
      // India export compliance: force Stripe to collect name + full billing address
      billing_address_collection: "required", // collects name + full billing address[web:44][web:47]
      customer_creation: "always", // creates a Customer with those details[web:45][web:47]
      // -------
    });

    // Create pending transaction record
    await StripeTransaction.create({
      user: userId,
      walletId,
      amount,
      stripeSessionId: session.id,
      paymentStatus: "pending",
      customerEmail: req.user.email,
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment session",
      error: error.message,
    });
  }
};

// Handle Stripe Webhooks
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const { userId, walletId, amount, type } = session.metadata;

      if (type !== "add_money") {
        return res.json({ received: true });
      }

      // Update StripeTransaction
      const stripeTransaction = await StripeTransaction.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          paymentStatus: "completed",
          stripePaymentIntentId: session.payment_intent,
          metadata: session.metadata,
        },
        { new: true }
      );

      if (!stripeTransaction) {
        console.error("Stripe transaction not found:", session.id);
        return res.status(404).json({ error: "Transaction not found" });
      }

      // Find user and update balance
      const user = await User.findById(userId);
      if (!user) {
        console.error("User not found:", userId);
        return res.status(404).json({ error: "User not found" });
      }

      // user.balance += parseFloat(amount);
      user.balance += Number(amount);
      await user.save();

      // Create transaction record
      await Transaction.create({
        user: userId,
        type: "add",
        amount: Number(amount),
        toWallet: walletId,
        // stripeSessionId: session.id,
        // paymentIntent: session.payment_intent,
        status: "success",
      });

      console.log(`Money added successfully: ₹${amount} to user ${userId}`);
    } catch (dbError) {
      console.error("Database update error:", dbError);

      // Mark as failed
      await StripeTransaction.findOneAndUpdate(
        { stripeSessionId: session.id },
        { paymentStatus: "failed" }
      );
    }
  }

  // Handle failed payment
  if (
    event.type === "checkout.session.expired" ||
    event.type === "payment_intent.payment_failed"
  ) {
    const session = event.data.object;

    await StripeTransaction.findOneAndUpdate(
      { stripeSessionId: session.id },
      { paymentStatus: "failed" }
    );
  }

  res.json({ received: true });
};

// Verify Session and Get Details
export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Get session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Get transaction from database
    const stripeTransaction = await StripeTransaction.findOne({
      stripeSessionId: sessionId,
    });

    if (!stripeTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      success: true,
      status: session.payment_status,
      paymentStatus: stripeTransaction.paymentStatus,
      amount: stripeTransaction.amount,
      currency: stripeTransaction.currency,
      customerEmail: session.customer_details?.email,
      createdAt: stripeTransaction.createdAt,
    });
  } catch (error) {
    console.error("Session verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify session",
      error: error.message,
    });
  }
};

// Get user's Stripe transaction history
export const getStripeTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await StripeTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};
