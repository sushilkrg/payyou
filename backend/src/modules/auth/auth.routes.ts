import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, signupSchema, verifyOtpSchema } from "./auth.schema";
import {
  checkEmail,
  checkUsername,
  login,
  logout,
  refreshToken,
  signup,
  verifyOtp,
} from "./auth.controller";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.get("/check-email", checkEmail);
router.get("/check-username", checkUsername);

export default router;
