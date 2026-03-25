import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(2, "At least 2 characters").max(50),
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(20)
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[0-9]/, "Must include a number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export const sendMoneySchema = z.object({
  recipientUsername: z
    .string()
    .min(3, "At least 3 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),

  amount: z
    .number("Enter a valid amount")
    .positive("Amount must be greater than 0")
    .max(100000, "Exceeds maximum transfer limit"),

  note: z.string().max(100, "Note too long").optional(),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type SendMoneyFormData = z.infer<typeof sendMoneySchema>;
