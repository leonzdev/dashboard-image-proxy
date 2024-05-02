export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const container = require('@/app/server_common/dependency')

        const gracefulshutdown: NodeJS.SignalsListener = async (signal: NodeJS.Signals): Promise<never> => {
            console.log(`Caught signal ${signal}. Shutting down...`)
            await container.close()
            process.exit(0)
        }
        if (process.env.NEXT_MANUAL_SIG_HANDLE) {
            process.on('SIGTERM', gracefulshutdown)
            process.on('SIGINT', gracefulshutdown)
        }
    }
}