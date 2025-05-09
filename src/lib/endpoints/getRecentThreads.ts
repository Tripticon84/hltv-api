import {
    HLTVConfig
} from '../config/configuration';

import {
    HLTVScraper
} from '../utils/scraper';
import {
    generateRandomSuffix
} from '../utils/utils';
import {
    fetchPage
} from '../utils/fetch';

import {
    Thread,
    ThreadCategory
} from '../types/getRecentThreads'

export const getRecentThreads =
    (config: HLTVConfig) => async (): Promise<Thread[]> => {
        const $ = HLTVScraper(
            await fetchPage(
                `https://www.hltv.org/${generateRandomSuffix()}`,
                config.loadPage
            )
        )

        const threads = $('.activity')
            .toArray()
            .map((el) => {
                const title = el.find('.topic').text()
                const link = el.attr('href')
                const replies = el.contents().last().numFromText()!
                const category = el
                    .attr('class')
                    .split(' ')
                    .find((c) => c.includes('Cat'))!
                    .replace('Cat', '') as ThreadCategory

                return { title, link, replies, category }
            })

        return threads
    }
