import { Response } from "express";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  role: string;
}

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role } as TokenPayload, ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role } as TokenPayload, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
  });
};
