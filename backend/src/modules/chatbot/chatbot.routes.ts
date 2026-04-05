import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { chatRequestSchema } from "./chatbot.schema";
import { chat } from "./chatbot.controller";

const router = Router();

router.post("/message", authMiddleware, validate(chatRequestSchema), chat);

export default router;
