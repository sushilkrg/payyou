import express from "express";
import { getHealthInfo } from "../controllers/healthController.js";

const router = express.Router();

router.get("/", getHealthInfo);

export default router;
