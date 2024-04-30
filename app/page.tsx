/* eslint @next/next/no-sync-scripts: 0 */
"use server"
import dependencies from '@/app/server_common/dependency'
import { DEFAULT_VIEWPORT_OPTIONS, ViewportOptions } from './dashboard'

function isAutorefreshValid(autoRefreshSecond: number|undefined): boolean {
    return autoRefreshSecond != null && !isNaN(autoRefreshSecond) && autoRefreshSecond > 0
}

export default async function Home({
    searchParams
}: {
    searchParams: {
        autoRefresh?: string,
        res?: string,
    }
}) {
    let autoRefreshSecond: number|undefined
    let viewportOptions: ViewportOptions|undefined
    if (searchParams.res) {
        const [width, height, deviceScaleFactor] = searchParams.res.split('x')
        viewportOptions = {
            ...DEFAULT_VIEWPORT_OPTIONS,
        }
        if (!isNaN(Number(width))) {
            viewportOptions.width = Number(width)
        }
        if (!isNaN(Number(height))) {
            viewportOptions.height = Number(height)
        }
        if (!isNaN(Number(deviceScaleFactor))) {
            viewportOptions.deviceScaleFactor = Number(deviceScaleFactor)
        }
    }
    if (searchParams.autoRefresh != null && !isNaN(Number(searchParams.autoRefresh))) {
        autoRefreshSecond = Number(searchParams.autoRefresh)
    }
    const dashboardPage = await dependencies.getDashboardPage()
    const screenshot = await dashboardPage.getScreenshot(viewportOptions)
    return (
        // <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <main>
            {isAutorefreshValid(autoRefreshSecond) ? <h1>Auto refresh in <span id="countdown">N/A</span> seconds</h1> : <></>}
            {/* @ts-ignore */}
            <script src="/script/autorefresh.js"></script>
            <img style={{width: "100vw"}} src={`data:image/png;base64, ${screenshot?.toString('base64')}`}/>
        </main>
    );
}
