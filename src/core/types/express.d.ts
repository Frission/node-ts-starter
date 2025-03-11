import type { JwtPayload } from "jsonwebtoken"
import type * as express from "express"

declare global {
    namespace Express {
        export interface Request {
            payload?: JwtPayload
            mongooseOptions?: Record<string, any>
        }
    }
}

export {}
