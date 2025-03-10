// src/apps/users/types/user.ts

import { Document } from "mongoose"
import { IBaseModel } from "../../../framework/database"

export type TUserRole = "admin" | "user" | "guest"

export interface IUser extends IBaseModel {
    firstname: string
    lastname: string
    email: string
    password: string
    role: TUserRole
    profilePhoto?: string
    verified: boolean
    active: boolean
}

export interface IUserModel extends IUser, IBaseModel, Document {}
