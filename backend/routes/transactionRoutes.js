import express from "express";
import { getMyTransactions } from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.get("/my", getMyTransactions);

export default router;
