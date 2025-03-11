import Redis from "ioredis"
import { config } from "../../../core/config/config"

let client: Redis | null = null

function init(): void {
    client = new Redis({
        port: config.redis.port, // Redis port from config
        host: config.redis.host, // Redis host from config
    })

    client.on("connect", () => {
        console.info("Client connected to Redis...")
    })

    client.on("ready", () => {
        console.info("Client connected to Redis and ready to use...")
    })

    client.on("error", err => {
        console.error(err.message)
    })

    client.on("end", () => {
        console.warn("Client disconnected from Redis")
    })

    process.on("SIGINT", () => {
        console.log("On client quit")
        if (client) {
            client.quit()
        }
    })
}

function getClient(): Redis {
    if (!client) {
        throw new Error("Redis client not initialized. Call init() first.")
    }
    return client
}

async function close(): Promise<void> {
    if (client) {
        await client.quit()
        console.warn("Redis connection is disconnected.")
    } else {
        console.warn("No Redis connection found to close.")
    }
}

export const redis = { init, getClient, close }
