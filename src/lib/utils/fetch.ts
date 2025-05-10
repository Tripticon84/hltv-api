import * as cheerio from 'cheerio';

export const fetchPage = async (
    url: string,
    loadPage: (url: string) => Promise<string>
): Promise<cheerio.CheerioAPI> => {
    try {
        const root = cheerio.load(await loadPage(url));
        const html = root.html();

        if (
            html.includes('error code:') ||
            html.includes('Sorry, you have been blocked') ||
            html.includes('Checking your browser before accessing') ||
            html.includes('Enable JavaScript and cookies to continue')
        ) {
            throw new Error('Access denied | www.hltv.org used Cloudflare to restrict access');
        }

        return root;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch page: ${error.message}`);
        }
        throw error;
    }
}; 