import { Request, Response } from "express"
import { ErrorResponseType } from "../../../core/types/service-response"
import ApiResponse from "../../../core/utils/handlers/api-reponse"
import { authService } from "../services/auth.service"

class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.register(req.body)
            if (response.success) {
                ApiResponse.success(res, response, 201)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async verifyAccount(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.verifyAccount(req.body)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async loginWithPassword(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.loginWithPassword(req.body)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async generateLoginOtp(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.generateLoginOtp(req.body.email)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async loginWithOtp(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.loginWithOtp(req.body)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.refresh(req.body.refreshToken)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const { accessToken, refreshToken } = req.body
            const response = await authService.logout(accessToken, refreshToken)
            if (response.success) {
                ApiResponse.success(res, response, 202)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.forgotPassword(req.body.email)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const response = await authService.resetPassword(req.body)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }
}

export const authController = new AuthController()
