import { Router } from "express"
import bruteForceMiddleware from "../../../core/middlewares/bruteforce"
import { validate } from "../../../core/middlewares/validate"
import { authController } from "../controllers/auth.controller"
import {
    registerSchema,
    verifyAccountSchema,
    generateLoginOtpSchema,
    loginWithPasswordSchema,
    loginWithOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshSchema,
    logoutSchema,
} from "../validators/auth"

export const AuthRoutes = Router()

AuthRoutes.post("/register", validate(registerSchema), authController.register)
AuthRoutes.post("/verify-account", validate(verifyAccountSchema), authController.verifyAccount)
AuthRoutes.post("/generate-login-otp", validate(generateLoginOtpSchema), authController.generateLoginOtp)
AuthRoutes.post(
    "/login-with-password",
    validate(loginWithPasswordSchema),
    bruteForceMiddleware,
    authController.loginWithPassword,
)
AuthRoutes.post("/login-with-otp", validate(loginWithOtpSchema), bruteForceMiddleware, authController.loginWithOtp)
AuthRoutes.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword)
AuthRoutes.patch("/reset-password", validate(resetPasswordSchema), authController.resetPassword)
AuthRoutes.post("/refresh", validate(refreshSchema), authController.refreshToken)
AuthRoutes.post("/logout", validate(logoutSchema), authController.logout)
