import express from "express";
import {
  getMyTransactions,
  getWeeklyTransactions,
} from "../controllers/transactionController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(isAuthenticated);
router.get("/my", getMyTransactions);
router.get("/weekly", getWeeklyTransactions);

export default router;
