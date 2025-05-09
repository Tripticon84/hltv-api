import { 
    HLTVConfig 
} from '../config/configuration';

import {
    HLTVScraper
} from '../utils/scraper';
import {
    generateRandomSuffix,
    parseNumber
} from '../utils/utils';
import {
    fetchPage
} from '../utils/fetch';

import {
    Country
} from '../types/shared/Country';
import { 
    FullStream, 
    StreamCategory 
} from '../types/getStreams';

export const getStreams =
    (config: HLTVConfig) => async (): Promise<FullStream[]> => {
        const $ = HLTVScraper(
            await fetchPage(
                `https://www.hltv.org/${generateRandomSuffix()}`,
                config.loadPage
            )
        )

        const streams = await Promise.all(
            $('.streams-stream')
                .toArray()
                .map(async (el) => {
                    const name = el.find('.streams-name').text()
                    const category = el
                        .find('.streams-category')
                        .attr('title') as StreamCategory

                    const country: Country = {
                        name: el.find('.streams-flag').attr('title'),
                        code: el
                            .find('.streams-flag')
                            .attrThen(
                                'src',
                                (x) => x.split('/').pop()?.split('.')[0]!
                            )
                    }

                    const viewers = el
                        .find('.streams-viewers')
                        .textThen((x) => parseNumber(x.replace(/\(|\)/g, '')))!

                    const link = el.data('frontpage-stream-embed-src')

                    const stream = { name, category, country, viewers, link }

                    return stream
                })
        )

        return streams
    }
