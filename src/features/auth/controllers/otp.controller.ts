import { Request, Response } from "express"
import { ErrorResponseType } from "../../../core/types/service-response"
import ApiResponse from "../../../core/utils/handlers/api-reponse"
import { otpService } from "../services/otp.service"

class OTPController {
    async generateOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email, purpose } = req.body
            const response = await otpService.generate(email, purpose)
            if (response.success) {
                ApiResponse.success(res, response, 201)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async validateOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email, code, purpose } = req.body
            const response = await otpService.validate(email, code, purpose)
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

export const otpController = new OTPController()
