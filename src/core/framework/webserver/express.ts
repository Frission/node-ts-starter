/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { initializeSession } from "../session"
import { apiRateLimiter, clientAuthentication, GlobalErrorHandler, NotFoundHandler } from "../../../common/shared"
import { default as AllRoutes } from "../../../common/globalRouter"
import { config } from "../../config"
import { helmetCSPConfig } from "../../constants"

const app = express()
const morganEnv = config.runningProd ? "combined" : "dev"

// Express configuration
app.use(cors())
app.use(helmet()) // Use Helmet to add various security headers
app.use(helmetCSPConfig)
app.use(helmet.frameguard({ action: "deny" })) // Prevent the app from being displayed in an iframe
app.use(helmet.xssFilter()) // Protect against XSS attacks
app.use(helmet.noSniff()) // Prevent MIME type sniffing
app.use(helmet.ieNoOpen()) // Prevent IE from executing downloads
app.use(morgan(morganEnv))
app.use(express.json())
app.disable("x-powered-by") // Disable X-Powered-By header

// Initialize Session
initializeSession(app)

// Client authentication middleware
app.use(clientAuthentication)

// Client authentication middleware
app.use(apiRateLimiter)

// API Routes
app.use("/api/v1", AllRoutes)

// Error handlers
app.use(NotFoundHandler)
app.use(GlobalErrorHandler)

export default app
