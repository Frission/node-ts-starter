import { Model } from "mongoose"
import { IUserModel } from "../types/user"
import { BaseRepository } from "../../../framework/database/mongoose/base/_repositories/base.repo"

export class UserRepository extends BaseRepository<IUserModel> {
    constructor(model: Model<IUserModel>) {
        super(model)
    }
}

export default UserRepository
