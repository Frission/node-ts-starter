import type { JwtPayload } from "jsonwebtoken"

declare global {
    namespace Express {
        export interface Request {
            payload?: JwtPayload
            mongooseOptions?: Record<string, any>
        }
    }
}

export {}

