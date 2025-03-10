import { Request, Response } from "express"
import { AuthService } from "../services"
import { ApiResponse, ErrorResponseType } from "../../../core"

class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const response = await AuthService.register(req.body)
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
            const response = await AuthService.verifyAccount(req.body)
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
            const response = await AuthService.loginWithPassword(req.body)
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
            const response = await AuthService.generateLoginOtp(req.body.email)
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
            const response = await AuthService.loginWithOtp(req.body)
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
            const response = await AuthService.refresh(req.body.refreshToken)
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
            const response = await AuthService.logout(accessToken, refreshToken)
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
            const response = await AuthService.forgotPassword(req.body.email)
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
            const response = await AuthService.resetPassword(req.body)
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

export default new AuthController()
