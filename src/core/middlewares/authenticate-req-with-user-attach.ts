import { Request, Response, NextFunction } from "express"
import { AsyncStorageService } from "../services/async-localstorage.service"
import { logger } from "../services/logger.service"
import { jwtService } from "../services/jwt.service"

export const authenticateAndAttachUserContext = (req: Request, res: Response, next: NextFunction) => {
    jwtService.verifyAccessToken(req, res, (authErr: any) => {
        if (authErr) {
            return next(authErr)
        }

        const payload = req.payload

        if (payload && typeof payload.aud === "string") {
            const userId = payload.aud
            const asyncStorage = AsyncStorageService.getInstance()

            asyncStorage.run(() => {
                asyncStorage.set("currentUserId", userId)
                next()
            })
        } else {
            logger.warn("Warning: Unable to attach user context, missing payload or audience field.")
            next()
        }
    })
}
