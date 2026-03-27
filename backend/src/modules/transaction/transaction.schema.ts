import z from "zod";

export const sendMoneySchema = z.object({
  recipientUsername: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_]+$/, "Invalid username format"),

  amount: z
    .number("Amount must be a number")
    .positive("Amount must be greater than 0")
    .max(100000, "Amount exceeds maximum transfer limit")
    .multipleOf(0.01, "Amount can have at most 2 decimal places"),

  note: z.string().max(100, "Note too long").optional(),
});

// Transaction query history schema
export const transactionQuerySchema = z.object({
  type: z.enum(["SEND", "RECEIVE", "ADD"]).optional(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)) //  default 1
    .pipe(z.number().min(1)),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)) //  default 10
    .pipe(z.number().min(1).max(50)),
});

export type SendMoneyInput = z.infer<typeof sendMoneySchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
