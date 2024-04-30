import { DashboardPage } from "../dashboard";
import globalConfig, {AppConfig} from '@/app/config';

export class Dependencies {
    dashboardPage?: DashboardPage

    constructor(private config: AppConfig) {
    }

    async getDashboardPage(): Promise<DashboardPage> {
        if (this.dashboardPage == null) {
            this.dashboardPage = new DashboardPage(this.config.dashboardUrl, this.config.authHeaderKey, this.config.authHeaderValue)
            await this.dashboardPage.init()
        }
        return this.dashboardPage
    }

    async init() {
        await this.getDashboardPage()
    }
}

const container = new Dependencies(globalConfig)
export default container
