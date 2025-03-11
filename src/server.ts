process.on("uncaughtException", function (err) {
    console.error("Uncaught Exception:", err)
})

import { logger } from "./core/services/logger.service"
import { config } from "./core/config/config"
import { app } from "./framework/webserver/express"
import { initServices } from "./helpers/init-services"

async function startServer() {
    try {
        await initServices()
        app.listen(config.port, () => {
            logger.info(`Server running on http://localhost:${config.port}`)
        })
    } catch (error) {
        logger.error("Failed to initialize services", error as any)
    }
}

startServer()
