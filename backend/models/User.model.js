import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    walletId: {
      type: String,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
