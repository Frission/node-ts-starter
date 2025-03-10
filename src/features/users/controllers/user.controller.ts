import { Request, Response } from "express"
import { UserService } from "../services"
import { ApiResponse, ErrorResponseType } from "../../../core"

class UserController {
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const response = await UserService.create(req.body)
            if (response.success) {
                ApiResponse.success(res, response, 201)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const response = await UserService.findAll(req.query)
            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id
            const response = await UserService.findOne({
                _id: userId,
            })

            if (response.success) {
                ApiResponse.success(res, response)
            } else {
                throw response
            }
        } catch (error) {
            ApiResponse.error(res, error as ErrorResponseType)
        }
    }

    async getCurrentUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).payload?.aud as string
            const response = await UserService.getProfile(userId)

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

export default new UserController()
