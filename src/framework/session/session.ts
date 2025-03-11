import { Application } from "express"
import session from "express-session"
import { config } from "../../core/config/config"

export const initializeSession = (app: Application): void => {
    app.use(
        session({
            secret: config.session.secret,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: config.runningProd },
        }),
    )
}
