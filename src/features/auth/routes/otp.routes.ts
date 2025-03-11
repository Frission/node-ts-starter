import { Router } from "express"
import { otpController } from "../controllers/otp.controller"

export const OTPRoutes = Router()

OTPRoutes.post("/generate", otpController.generateOTP)
OTPRoutes.post("/validate", otpController.validateOTP)
