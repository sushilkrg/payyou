import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  amount: z
    .number("Amount must be a number")
    .positive("Amount must be greater than 0")
    .min(10, "Minimum amount is ₹10")
    .max(100000, "Maximum amount is ₹1,00,000")
    .multipleOf(0.01, "Amount can have at most 2 decimal places"),
});

export type CreatePaymentIntentInput = z.infer<
  typeof createPaymentIntentSchema
>;
