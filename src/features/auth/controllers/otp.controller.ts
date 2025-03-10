import { Request, Response } from "express"
import { ApiResponse, ErrorResponseType } from "../../../core"
import { OTPService } from "../services"

class OTPController {
    async generateOTP(req: Request, res: Response): Promise<void> {
        try {
            const { email, purpose } = req.body
            const response = await OTPService.generate(email, purpose)
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
            const response = await OTPService.validate(email, code, purpose)
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

export default new OTPController()
