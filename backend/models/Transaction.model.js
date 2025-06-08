import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["add", "send", "receive"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fromWallet: {
      type: String,
    },
    toWallet: {
      type: String,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
