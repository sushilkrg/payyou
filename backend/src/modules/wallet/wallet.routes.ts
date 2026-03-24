import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getWallet } from "./wallet.controller";

const router = Router();

router.get("/", authMiddleware, getWallet);

export default router;
