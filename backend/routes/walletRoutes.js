import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addMoney,
  generateWalletId,
  getWalletInfo,
  sendMoney,
} from "../controllers/walletController.js";

const router = express.Router();
router.use(isAuthenticated);

router.post("/generate", generateWalletId);
router.get("/", getWalletInfo);
router.post("/add", addMoney);
router.post("/send", sendMoney);

export default router;
