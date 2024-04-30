import puppeteer, {Browser, GoToOptions, Page, Viewport, WaitForOptions} from 'puppeteer'
import globalConfig from './config'
// mostly from: https://gist.github.com/adamelliotfields/e0e503e1ba17ab13a3b1e2b7c263cb0e
export type ViewportOptions =  {
    width?: number,
    deviceScaleFactor?: number,
    height?: number
}

export type ScreenshotOptions = {
    fullPage: boolean,
    clip?: any,
    captureBeyondViewport?: boolean
}

const getHeight = (element: any) => {
    const { height } = element.getBoundingClientRect();
    return height;
};

const getClip = (element: any) => {
    const { height, width, x, y } = element.getBoundingClientRect();
    return { height, width, x, y };
};

const selectorOptions = {
    timeout: 60000,
    visible: true,
};
const pageOptions: GoToOptions|WaitForOptions = {
    timeout: 60000,
    waitUntil: 'networkidle2',
}
const selector = '.react-grid-layout';

export const DEFAULT_VIEWPORT_OPTIONS: ViewportOptions = {
    width: 1200,
    height: 1920,
    deviceScaleFactor: 1,
}

/**
 * Example viewportOptions: {
    width: 1200,
    deviceScaleFactor: 2,
  };
 */
export class DashboardPage {
    private browser: Browser|null = null
    private page: Page|null = null
    private screenshotOptions: ScreenshotOptions = {
        fullPage: true,
        captureBeyondViewport: false
    };
    private currentViewport = DEFAULT_VIEWPORT_OPTIONS
    // public viewportOptions = DEFAULT_VIEWPORT_OPTIONS
    constructor(public dashUrl: string, public authHeaderKey: string, public authHeaderValue: string) {}

    async init() {
        if (this.browser == null) {
            this.browser = await puppeteer.launch({
                headless: globalConfig.isHeadless
            });
            this.page = await this.browser.newPage();
            await this.page.setExtraHTTPHeaders({
                [this.authHeaderKey]: this.authHeaderValue
            })
            
            // Navigate the page to a URL
            await this.page.goto(this.dashUrl, pageOptions);
            
            await this.page.waitForSelector(selector, selectorOptions);
          
            // Resize the viewport and reload the page so all panels load.
            await this.setViewport(DEFAULT_VIEWPORT_OPTIONS)
        }
    }
    async getScreenshot(viewportOptions?: ViewportOptions): Promise<Buffer|undefined> {
        await this.init()
        if (viewportOptions != null && !this.isSameViewport(viewportOptions)) {
            console.log(`Set new viewport: ${JSON.stringify(viewportOptions)}`)
            await this.setViewport(viewportOptions)
        } else if (globalConfig.shouldReloadBeforeScreenshot){
            await this.page?.reload(pageOptions);
        }
        return await this.page?.screenshot(this.screenshotOptions)
    }

    async setViewport(viewportOptions: ViewportOptions) {
        await this.page?.setViewport(viewportOptions as Viewport); // cast
        await this.page?.reload(pageOptions);
        this.currentViewport = viewportOptions;
        await this.page?.waitForSelector(selector, selectorOptions);
        this.screenshotOptions.clip = await this.page?.$eval(selector, getClip)
    }

    isSameViewport(viewportOptions: ViewportOptions): boolean {
        return viewportOptions.height === this.currentViewport.height 
            && viewportOptions.width === this.currentViewport.width 
            && viewportOptions.deviceScaleFactor === this.currentViewport.deviceScaleFactor;
    }

    async close() {
        if (this.page != null) {
            await this.page.close()
        }
        if (this.browser != null) {
            await this.browser.close()
        }
        this.page = null
        this.browser = null
    }
}
