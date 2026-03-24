import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { LoginInput, SignupInput, VerifyOtpInput } from "./auth.schema";
import { sendOtpEmail } from "../../lib/mailer";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../lib/tokens";

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signupService = async (data: SignupInput) => {
  const { fullName, username, email, password } = data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new Error("EMAIL_TAKEN");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    throw new Error("USERNAME_TAKEN");
  }

  // Rate limit OTP requests — max 3 per 15 minutes per email
  // Prevents someone spamming the signup endpoint to flood a mailbox

  const rateLimitKey = `rate:otp:${email}`;
  const attempts = await redis.incr(rateLimitKey);
  if (attempts === 1) {
    // set TTL on first attempt
    await redis.expire(rateLimitKey, 15 * 60); 
  }
  if (attempts > 3) {
    throw new Error("OTP_RATE_LIMIT");
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { fullName, username, email, passwordHash, isVerified: false },
  });

  // generate OTP with 5 min TTL
  const otp = generateOtp();
  await redis.set(`otp:${email}`, String(otp), { ex: 5 * 60 });

  await sendOtpEmail(email, otp);

  return { message: "OTP sent to your email", userId: user.id };
};

export const verifyOtpService = async (data: VerifyOtpInput) => {
  const { email, otp } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("USER_NOT_FOUND");
  if (user.isVerified) throw new Error("ALREADY_VERIFIED");

  // fetch OTP from redis
  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) throw new Error("OTP_EXPIRED");

  // compare OTP
  if (String(storedOtp) !== String(otp)) throw new Error("OTP_INVALID");

  // mark verified + create wallet atomically using prisma transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { isVerified: true },
    }),
    prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        dailyLimit: 10000,
      },
    }),
  ]);

  // delete OTP from redis
  await redis.del(`otp:${email}`);

  // generate token
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginService = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  if (!user.isVerified) throw new Error("NOT_VERIFIED");

  // compare password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("INVALID_CREDENTIALS");

  // generate token
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isVerified) throw new Error("UNAUTHORIZED");

  const newAccessToken = generateAccessToken(user.id, user.role);
  return { accessToken: newAccessToken };
};

export const checkEmailService = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return { available: !user };
};

export const checkUsernameService = async (username: string) => {
  const user = await prisma.user.findUnique({ where: { username } });
  return { available: !user };
};
