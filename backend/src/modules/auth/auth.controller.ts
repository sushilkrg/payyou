import { Request, Response } from "express";
import {
  checkEmailService,
  checkUsernameService,
  loginService,
  refreshTokenService,
  signupService,
  verifyOtpService,
} from "./auth.service";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from "../../lib/tokens";

// Error code -> HTTP Response Mapper
const handleError = (res: Response, err: unknown): void => {
  const message = err instanceof Error ? err.message : "INTERNAL_ERROR";
  const errorMap: Record<string, { status: number; message: string }> = {
    EMAIL_TAKEN: { status: 409, message: "Email already registered" },
    USERNAME_TAKEN: { status: 409, message: "Username already taken" },
    OTP_RATE_LIMIT: {
      status: 429,
      message: "Too many OTP requests. Try after 15 minutes",
    },
    OTP_EXPIRED: { status: 400, message: "OTP expired. Request a new one" },
    OTP_INVALID: { status: 400, message: "Invalid OTP" },
    USER_NOT_FOUND: { status: 404, message: "User not found" },
    ALREADY_VERIFIED: { status: 400, message: "Account already verified" },
    INVALID_CREDENTIALS: { status: 401, message: "Invalid email or password" },
    NOT_VERIFIED: { status: 403, message: "Please verify your email first" },
    UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  };

  const mapped = errorMap[message];
  if (mapped) {
    res.status(mapped.status).json({ success: false, message: mapped.message });
  } else {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await signupService(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await verifyOtpService(req.body);

    setRefreshTokenCookie(res, result.refreshToken);
    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginService(req.body);
    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Read refresh token from httpOnly cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ success: false, message: "No refresh token" });
      return;
    }

    const result = await refreshTokenService(token);
    res.status(200).json({ success: true, accessToken: result.accessToken });
  } catch (err) {
    handleError(res, err);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  clearRefreshTokenCookie(res);
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const checkEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.query as { email: string };
    if (!email) {
      res.status(400).json({ success: false, message: "Email required" });
      return;
    }
    const result = await checkEmailService(email);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};

export const checkUsername = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username } = req.query as { username: string };
    if (!username) {
      res.status(400).json({ success: false, message: "Username required" });
      return;
    }
    const result = await checkUsernameService(username);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    handleError(res, err);
  }
};
