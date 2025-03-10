import { config } from "../../../core"
import bcrypt from "bcrypt"
import { ErrorResponse, ErrorResponseType, SuccessResponseType } from "../../../core"
import { IUserModel } from "../types"
import { UserModel } from "../models"
import { UserRepository } from "../repositories"
import { BaseService } from "../../../framework/database"

class UserService extends BaseService<IUserModel, UserRepository> {
    constructor() {
        const userRepo = new UserRepository(UserModel)
        super(userRepo, true /*, ['profilePicture']*/)
        this.searchFields = ["firstName", "lastName", "email"]
    }

    async isValidPassword(
        userId: string,
        password: string,
    ): Promise<SuccessResponseType<{ isValid: boolean }> | ErrorResponseType> {
        try {
            const response = await this.findOne({ _id: userId })
            if (!response.success || !response.document) {
                throw response.error
            }

            const isValid = await bcrypt.compare(password, response.document.password)
            return { success: true, document: { isValid } }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("UNKNOWN_ERROR", (error as Error).message),
            }
        }
    }

    async updatePassword(
        userId: string,
        newPassword: string,
    ): Promise<SuccessResponseType<IUserModel> | ErrorResponseType> {
        try {
            const response = await this.findOne({ _id: userId })
            if (!response.success || !response.document) {
                throw response.error
            }

            const hashedPassword = await bcrypt.hash(newPassword, config.bcrypt.saltRounds)
            const updateResponse = await this.update({ _id: userId }, { password: hashedPassword })

            if (!updateResponse.success) {
                throw updateResponse.error
            }

            return {
                success: true,
                document: updateResponse.document,
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("UNKNOWN_ERROR", (error as Error).message),
            }
        }
    }

    async isVerified(email: string): Promise<SuccessResponseType<{ verified: boolean }> | ErrorResponseType> {
        try {
            const response = await this.findOne({ email })
            if (!response.success || !response.document) {
                throw response.error
            }

            return {
                success: true,
                document: { verified: response.document.verified },
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("UNKNOWN_ERROR", (error as Error).message),
            }
        }
    }

    async markAsVerified(email: string): Promise<SuccessResponseType<IUserModel> | ErrorResponseType> {
        try {
            const response = await this.findOne({ email })
            if (!response.success || !response.document) {
                throw response.error
            }

            const updateResponse = await this.update({ _id: response.document._id }, { verified: true })

            if (!updateResponse.success) {
                throw updateResponse.error
            }

            return {
                success: true,
                document: updateResponse.document,
            }
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof ErrorResponse
                        ? error
                        : new ErrorResponse("UNKNOWN_ERROR", (error as Error).message),
            }
        }
    }

    async getProfile(userId?: string | undefined): Promise<SuccessResponseType<IUserModel> | ErrorResponseType> {
        try {
            if (!userId) {
                throw new ErrorResponse("BAD_REQUEST", "User ID is required.")
            }

            const user = await this.findOne({ _id: userId })

            if (!user.success || !user.document) {
                throw new ErrorResponse("NOT_FOUND_ERROR", "User not found.")
            }

            return {
                success: true,
                document: {
                    firstname: user.document.firstname,
                    lastname: user.document.lastname,
                    email: user.document.email,
                    verified: user.document.verified,
                    active: user.document.active,
                    role: user.document.role,
                } as any, // As we are not sending user password, we need to mention any here to avoid type check error
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
}

export default new UserService()
