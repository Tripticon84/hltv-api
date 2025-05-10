import {
    Agent as HttpsAgent
} from 'https';
import {
    Agent as HttpAgent
} from 'http';

import { 
    chromium 
} from 'playwright';

export interface HLTVConfig {
    loadPage: (url: string) => Promise<string>;
    httpAgent: HttpsAgent | HttpAgent;
};

let browser: any = null;
let context: any = null;

export const defaultLoadPage = (httpAgent: HttpsAgent | HttpAgent | undefined) => {
    return async (url: string) => {
        if (!browser) {
            browser = await chromium.launch({
                headless: true,
                args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
            });
            context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                bypassCSP: true,
                ignoreHTTPSErrors: true
            });
        }

        const page = await context.newPage();
        try {
            await page.goto(url, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000
            });
            const content = await page.content();
            return content;
        } finally {
            await page.close();
        }
    };
};

const defaultAgent = new HttpsAgent();

export const defaultConfig: HLTVConfig = {
    httpAgent: defaultAgent,
    loadPage: defaultLoadPage(defaultAgent)
};