import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import OTP from "../models/VerificationCode.model.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendMail } from "../utils/sendMail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({ email, otp: otpCode, expiresAt });

    // send otp via email
    await sendMail(
      email,
      "Verify your email",
      `Your OTP for verifying your email is: ${otpCode}. It is valid for 10 minutes.`
    );

    res.status(201).json({ message: "User registered, OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    
    if (!otpRecord || otpRecord.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark user as verified
    await User.updateOne({ email }, { isVerified: true });

    // Delete OTP
    await OTP.deleteMany({ email });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(403).message("Email not verified");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        walletId: user.walletId,
        balance: user.balance,
        id: user._id,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
