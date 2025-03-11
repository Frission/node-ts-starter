import { config } from "../../../core/config/config"
import { jwtService } from "../../../core/services/jwt.service"
import MailServiceUtilities from "../../../core/services/mail/mail.service.utility"
import { SuccessResponseType, ErrorResponseType } from "../../../core/types/service-response"
import { ErrorResponse } from "../../../core/utils/handlers/error"
import { userService } from "../../users/services/user.service"
import { IUserModel } from "../../users/types/user"
import { IOTPModel } from "../types/otp"
import { otpService } from "./otp.service"

class AuthService {
    async register(payload: {
        email: string
    }): Promise<SuccessResponseType<{ user: IUserModel; otp?: IOTPModel }> | ErrorResponseType> {
        try {
            const { email } = payload
            const userResponse = await userService.findOne({ email })

            if (userResponse.success && userResponse.document) {
                throw new ErrorResponse("UNIQUE_FIELD_ERROR", "The entered email is already registered.")
            }

            const createUserResponse = await userService.create(payload)

            if (!createUserResponse.success || !createUserResponse.document) {
                throw createUserResponse.error
            }

            await MailServiceUtilities.sendAccountCreationEmail({
                to: email,
                firstname: createUserResponse.document.firstname,
            })

            const otpResponse = await otpService.generate(email, config.otp.purposes.ACCOUNT_VERIFICATION.code)

            if (!otpResponse.success || !otpResponse.document) {
                throw otpResponse.error
            }

            return {
                success: true,
                document: {
                    user: createUserResponse.document,
                    otp: otpResponse.document,
                },
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async verifyAccount(payload: {
        email: string
        code: string
    }): Promise<SuccessResponseType<null> | ErrorResponseType> {
        try {
            const { email, code } = payload
            const userResponse = await userService.findOne({ email })

            if (!userResponse.success || !userResponse.document) {
                throw new ErrorResponse("NOT_FOUND_ERROR", "User not found.")
            }

            if (userResponse.document.verified) {
                return { success: true } // If already verified, return success without further actions
            }

            const validateOtpResponse = await otpService.validate(
                email,
                code,
                config.otp.purposes.ACCOUNT_VERIFICATION.code,
            )

            if (!validateOtpResponse.success) {
                throw validateOtpResponse.error
            }

            const verifyUserResponse = await userService.markAsVerified(email)

            if (!verifyUserResponse.success) {
                throw verifyUserResponse.error
            }

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async generateLoginOtp(email: string): Promise<SuccessResponseType<IOTPModel> | ErrorResponseType> {
        try {
            const userResponse = await userService.findOne({ email })

            if (!userResponse.success || !userResponse.document) {
                throw new ErrorResponse("NOT_FOUND_ERROR", "User not found.")
            }

            const user = userResponse.document

            if (!user.verified) {
                throw new ErrorResponse("UNAUTHORIZED", "Unverified account.")
            }

            if (!user.active) {
                throw new ErrorResponse("FORBIDDEN", "Inactive account, please contact admins.")
            }

            const otpResponse = await otpService.generate(email, config.otp.purposes.LOGIN_CONFIRMATION.code)

            if (!otpResponse.success) {
                throw otpResponse.error
            }

            return otpResponse
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async loginWithPassword(payload: any): Promise<SuccessResponseType<any> | ErrorResponseType> {
        try {
            const { email, password } = payload
            const userResponse = await userService.findOne({ email })

            if (!userResponse.success || !userResponse.document) {
                throw new ErrorResponse("UNAUTHORIZED", "Invalid credentials.")
            }

            const user = userResponse.document
            const isValidPasswordResponse = await userService.isValidPassword(user.id, password)

            if (!isValidPasswordResponse.success || !isValidPasswordResponse.document?.isValid) {
                throw new ErrorResponse("UNAUTHORIZED", "Invalid credentials.")
            }

            if (!user.verified) {
                throw new ErrorResponse("UNAUTHORIZED", "Unverified account.")
            }

            if (!user.active) {
                throw new ErrorResponse("FORBIDDEN", "Inactive account, please contact admins.")
            }

            const accessToken = await jwtService.signAccessToken(user.id)
            const refreshToken = await jwtService.signRefreshToken(user.id)

            return {
                success: true,
                document: {
                    token: { access: accessToken, refresh: refreshToken },
                    user,
                },
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async loginWithOtp(payload: any): Promise<SuccessResponseType<any> | ErrorResponseType> {
        try {
            const { email, code } = payload
            const userResponse = await userService.findOne({ email })

            if (!userResponse.success || !userResponse.document) {
                throw new ErrorResponse("UNAUTHORIZED", "Invalid credentials.")
            }

            const user = userResponse.document

            const validateOtpResponse = await otpService.validate(
                email,
                code,
                config.otp.purposes.LOGIN_CONFIRMATION.code,
            )

            if (!validateOtpResponse.success) {
                throw validateOtpResponse.error
            }

            if (!user.verified) {
                throw new ErrorResponse("UNAUTHORIZED", "Unverified account.")
            }

            if (!user.active) {
                throw new ErrorResponse("FORBIDDEN", "Inactive account, please contact admins.")
            }

            const accessToken = await jwtService.signAccessToken(user.id)
            const refreshToken = await jwtService.signRefreshToken(user.id)

            return {
                success: true,
                document: {
                    token: { access: accessToken, refresh: refreshToken },
                    user,
                },
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async refresh(refreshToken: string): Promise<SuccessResponseType<any> | ErrorResponseType> {
        try {
            if (!refreshToken) {
                throw new ErrorResponse("BAD_REQUEST", "Refresh token is required.")
            }

            const userId = await jwtService.verifyRefreshToken(refreshToken)
            const accessToken = await jwtService.signAccessToken(userId)
            // Refresh token change to ensure rotation
            const newRefreshToken = await jwtService.signRefreshToken(userId)

            return {
                success: true,
                document: { token: { access: accessToken, refresh: newRefreshToken } },
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async logout(accessToken: string, refreshToken: string): Promise<SuccessResponseType<null> | ErrorResponseType> {
        try {
            if (!refreshToken || !accessToken) {
                throw new ErrorResponse("BAD_REQUEST", "Refresh and access token are required.")
            }

            const { userId: userIdFromRefresh } = await jwtService.checkRefreshToken(refreshToken)
            const { userId: userIdFromAccess } = await jwtService.checkAccessToken(accessToken)

            if (userIdFromRefresh !== userIdFromAccess) {
                throw new ErrorResponse("UNAUTHORIZED", "Access token does not match refresh token.")
            }

            // Blacklist the access token
            await jwtService.blacklistToken(accessToken)

            // Remove the refresh token from Redis
            await jwtService.removeFromRedis(userIdFromRefresh)

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async forgotPassword(email: string): Promise<SuccessResponseType<null> | ErrorResponseType> {
        try {
            if (!email) {
                throw new ErrorResponse("BAD_REQUEST", "Email should be provided.")
            }

            const userResponse = await userService.findOne({ email })

            if (!userResponse.success || !userResponse.document) {
                throw new ErrorResponse("NOT_FOUND_ERROR", "User not found.")
            }

            const user = userResponse.document

            if (!user.verified) {
                throw new ErrorResponse("UNAUTHORIZED", "Unverified account.")
            }

            if (!user.active) {
                throw new ErrorResponse("FORBIDDEN", "Inactive account, please contact admins.")
            }

            const otpResponse = await otpService.generate(email, config.otp.purposes.FORGOT_PASSWORD.code)

            if (!otpResponse.success) {
                throw otpResponse.error
            }

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }

    async resetPassword(payload: any): Promise<SuccessResponseType<null> | ErrorResponseType> {
        try {
            // We suppose a verification about new password and confirmation password have already been done
            const { email, code, newPassword } = payload

            const userResponse = await userService.findOne({ email })

            if (!userResponse.success || !userResponse.document) {
                throw new ErrorResponse("NOT_FOUND_ERROR", "User not found.")
            }

            const user = userResponse.document

            if (!user.verified) {
                throw new ErrorResponse("UNAUTHORIZED", "Unverified account.")
            }

            if (!user.active) {
                throw new ErrorResponse("FORBIDDEN", "Inactive account, please contact admins.")
            }

            const validateOtpResponse = await otpService.validate(email, code, config.otp.purposes.FORGOT_PASSWORD.code)

            if (!validateOtpResponse.success) {
                throw validateOtpResponse.error
            }

            const updatePasswordResponse = await userService.updatePassword(user.id, newPassword)

            if (!updatePasswordResponse.success) {
                throw updatePasswordResponse.error
            }

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("INTERNAL_SERVER_ERROR", (error as Error).message),
            }
        }
    }
}

export const authService = new AuthService()
