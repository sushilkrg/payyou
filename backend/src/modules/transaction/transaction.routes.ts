import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  checkRecipient,
  getTransactions,
  sendMoney,
} from "./transaction.controller";
import { validate } from "../../middlewares/validate.middleware";
import { sendMoneySchema } from "./transaction.schema";

const router = Router();

router.get("/check-recipient", authMiddleware, checkRecipient);
router.post("/send", authMiddleware, validate(sendMoneySchema), sendMoney);
router.get("/", authMiddleware, getTransactions);

export default router;
