import {
    stringify
} from 'querystring';

import {
    HLTVConfig
} from '../config/configuration';

import {
    HLTVScraper
} from '../utils/scraper';
import {
    fetchPage
} from '../utils/fetch';

import {
    GetNewsArguments,
    NewsPreview
} from '../types/getNews'

export const getNews =
    (config: HLTVConfig) =>
        async ({ year, month, eventIds }: GetNewsArguments = {}): Promise<
            NewsPreview[]
        > => {
            let url = 'https://www.hltv.org/news/archive'

            if (eventIds) {
                url = `${url}?${stringify({ event: eventIds })}`
            } else if (year && month) {
                url = `${url}/${year}/${month}`
            }

            const $ = HLTVScraper(await fetchPage(url, config.loadPage))

            const news = $('.article')
                .toArray()
                .map((el) => {
                    const link = el.attr('href')
                    const title = el.find('.newstext').text()
                    const comments = parseInt(
                        el.find('.newstc').children().last().text()
                    )
                    const date = new Date(el.find('.newsrecent').text()).getTime()
                    const country = {
                        name: el.find('.newsflag').attr('alt'),
                        code: el
                            .find('.newsflag')
                            .attr('src')
                            .split('/')
                            .pop()!
                            .split('.')[0]
                    }

                    return { link, title, comments, date, country }
                })

            return news
        }
