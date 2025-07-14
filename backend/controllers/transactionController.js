import mongoose from "mongoose";
import Transaction from "../models/Transaction.model.js";

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
