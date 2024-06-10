const DEFAULT_AUTH_HEADER_KEY = 'Authorization'
const DEFAULT_RELOAD_INTERVAL = 3600 // 1 hour in second
function fatal(msg: string): never {
    console.error(msg);
    process.exit(1)
}

export type AppConfig = {
    dashboardUrl: string,
    authHeaderKey: string,
    authHeaderValue: string,
    isHeadless: boolean,
    shouldReloadBeforeScreenshot: boolean,
    reloadInterval: number,
}

function getReloadIntervalFromEnv(): number {
    const reloadIntervalEnv = process.env.RELOAD_INTERVAL
    if (!reloadIntervalEnv) {
        return DEFAULT_RELOAD_INTERVAL
    } 
    if (isNaN(Number(reloadIntervalEnv))) {
        return DEFAULT_RELOAD_INTERVAL
    }
    const reloadInterval = Number(reloadIntervalEnv)
    if (reloadInterval <= 0) {
        return DEFAULT_RELOAD_INTERVAL
    }
    return reloadInterval
}

const globalConfig: AppConfig = {
    dashboardUrl: process.env.DASH_URL || fatal('DASH_URL is required'),
    authHeaderKey: process.env.AUTH_HEADER_KEY || DEFAULT_AUTH_HEADER_KEY,
    authHeaderValue: process.env.AUTH_HEADER_VALUE || fatal('AUTH_HEADER_VALUE is required'),
    isHeadless: process.env.HEADLESS ? process.env.HEADLESS.toLocaleLowerCase() === 'true' : false,
    shouldReloadBeforeScreenshot: process.env.RELOAD ? process.env.RELOAD.toLocaleLowerCase() === 'true' : false,
    reloadInterval: getReloadIntervalFromEnv()
}

export default globalConfig