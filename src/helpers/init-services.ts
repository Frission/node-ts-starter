import { testDatabaseConnection } from "./db-connection-test"
import { testRedisConnection } from "./redis-test"

async function initServices(): Promise<void> {
    await testDatabaseConnection()
    await testRedisConnection()
}

export { initServices }
