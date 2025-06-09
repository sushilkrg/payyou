import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addMoney,
  generateWalletId,
  getWalletInfo,
  sendMoney,
} from "../controllers/walletController.js";

const router = express.Router();
router.use(protect);

router.post("/generate", generateWalletId);
router.get("/me", getWalletInfo);
router.post("/add", addMoney);
router.post("/send", sendMoney);

export default router;
