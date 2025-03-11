import { Request, Response } from "express"
import { ErrorResponseType } from "../../../core/types/service-response"
import ApiResponse from "../../../core/utils/handlers/api-reponse"
import { userService } from "../services/user.service"

class UserController {
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const response = await userService.create(req.body)
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
            const response = await userService.findAll(req.query)
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
            const response = await userService.findOne({
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
            const userId = req.payload?.aud as string
            const response = await userService.getProfile(userId)

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

export const userController = new UserController()
