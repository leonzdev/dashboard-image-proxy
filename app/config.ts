const DEFAULT_AUTH_HEADER_KEY = 'Authorization'
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
}

const globalConfig: AppConfig = {
    dashboardUrl: process.env.DASH_URL || fatal('DASH_URL is required'),
    authHeaderKey: process.env.AUTH_HEADER_KEY || DEFAULT_AUTH_HEADER_KEY,
    authHeaderValue: process.env.AUTH_HEADER_VALUE || fatal('AUTH_HEADER_VALUE is required'),
    isHeadless: process.env.HEADLESS ? process.env.HEADLESS.toLocaleLowerCase() === 'true' : false,
    shouldReloadBeforeScreenshot: process.env.RELOAD ? process.env.RELOAD.toLocaleLowerCase() === 'true' : false,
}

export default globalConfig