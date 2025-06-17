import express from "express";
import { getMyTransactions } from "../controllers/transactionController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(isAuthenticated);
router.get("/my", getMyTransactions);

export default router;
