import { v4 as uuidv4 } from "uuid";
import User from "../models/User.model.js";
import Transaction from "../models/Transaction.model.js";
import mongoose from "mongoose";

export const generateWalletId = async (req, res) => {
  try {
    if (req.user.walletId) {
      return res.status(400).json({ message: "Wallet id already exists." });
    }

    function generate10DigitUniqueId() {
      const uuid = uuidv4();
      const uuidString = uuid.replace(/-/g, "");
      const uuidNumber = parseInt(uuidString, 16);
      const uniqueId = uuidNumber % 10000000000;
      return String(uniqueId).padStart(10, "0");
    }

    const walletId = generate10DigitUniqueId();
    req.user.walletId = walletId;
    await req.user.save();

    res
      .status(200)
      .json({ message: "Wallet id created successfully", walletId });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const getWalletInfo = async (req, res) => {
  res.json({
    walletInfo: req.user.walletId,
    balance: req.user.balance,
    email: req.user.email,
    name: req.user.name,
  });
};

export const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    req.user.balance += amount;
    await req.user.save();

    await Transaction.create({
      user: req.user._id,
      type: "add",
      amount,
      toWallet: req.user.walletId,
    });

    return res
      .status(201)
      .json({ message: "Money added", balance: req.user.balance });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Server", error: err.message });
  }
};

export const sendMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { toWalletId, amount } = req.body;
    if (amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const sender = await User.findById(req.user._id).session(session);
    const receiver = await User.findOne({ walletId: toWalletId }).session(
      session
    );

    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender.walletId === receiver.walletId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update balances
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    // Record Transactions
    await Transaction.create(
      [
        {
          user: sender._id,
          type: "send",
          amount,
          fromWallet: sender.walletId,
          toWallet: receiver.walletId,
        },
        {
          user: receiver._id,
          type: "receive",
          amount,
          fromWallet: sender.walletId,
          toWallet: receiver.walletId,
        },
      ],
      { session, ordered: true }
    );

    await session.commitTransaction();
    session.endSession();
    res
      .status(201)
      .json({ message: "Money sent successfully", balance: sender.balance });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Transaction failed", error: err.message });
  }
};
