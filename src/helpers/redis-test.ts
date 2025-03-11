import { logger } from "../core/services/logger.service"
import { redis } from "../framework/database/redis/redis"

async function testRedisConnection(): Promise<void> {
    try {
        redis.init()
        const client = redis.getClient()
        await client.ping()
        logger.info("Redis is successfully connected and working.")
    } catch (error) {
        logger.error("Redis connection error:", error as Error)
        throw error
    }
}

export { testRedisConnection }
