process.on("uncaughtException", function (err) {
    console.error("Uncaught Exception:", err)
})

import { initServices } from "./helpers"
import { logger } from "./core"
import { config } from "./core"
import { WebServer } from "./framework"

async function startServer() {
    try {
        await initServices()
        const app = WebServer.app
        app.listen(config.port, () => {
            logger.info(`Server running on http://localhost:${config.port}`)
        })
    } catch (error) {
        logger.error("Failed to initialize services", error as any)
    }
}

startServer()
