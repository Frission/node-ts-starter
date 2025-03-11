import { Request, Response, NextFunction } from "express"
import { AsyncStorageService } from "../services/async-localstorage.service"
import { logger } from "../services/logger.service"

export const attachUserToContext = (req: Request, res: Response, next: NextFunction) => {
    const asyncStorage = AsyncStorageService.getInstance()
    const payload = req.payload
    if (payload && typeof payload.aud === "string") {
        const userId = payload.aud

        asyncStorage.run(() => {
            asyncStorage.set("currentUserId", userId)
            next()
        })
    } else {
        logger.warn("Warning: Unable to attach user context, missing payload or audience field.")
        next()
    }
}
