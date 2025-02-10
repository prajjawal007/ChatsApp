import express from "express";
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyForgotPasswordOtp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login", login);
router.post("/logout",logout);
router.post("/forgot-password",forgotPassword);
router.post("/verify-forgot-password-otp",verifyForgotPasswordOtp);
router.post("/reset-password",resetPassword);
router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);



export default router;
