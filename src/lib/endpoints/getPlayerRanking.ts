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
    getIdAt
} from '../utils/utils';
import {
    fetchPage
} from '../utils/fetch';

import {
    toMapFilter
} from '../types/shared/GameMap';
import {
    PlayerRanking,
    GetPlayerRankingOptions
} from '../types/getPlayerRanking';

export const getPlayerRanking =
    (config: HLTVConfig) =>
        async (options: GetPlayerRankingOptions = {}): Promise<PlayerRanking[]> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
                ...(options.matchType ? { matchType: options.matchType } : {}),
                ...(options.rankingFilter
                    ? { rankingFilter: options.rankingFilter }
                    : {}),
                ...(options.maps ? { maps: options.maps.map(toMapFilter) } : {}),
                ...(options.minMapCount
                    ? { minMapCount: options.minMapCount }
                    : {}),
                ...(options.countries ? { country: options.countries } : {}),
                ...(options.bestOfX ? { bestOfX: options.bestOfX } : {})
            })

            const $ = HLTVScraper(
                await fetchPage(
                    `https://www.hltv.org/stats/players?${query}`,
                    config.loadPage
                )
            )

            return $('.player-ratings-table tbody tr')
                .toArray()
                .map((el) => {
                    const id = el.find('.playerCol a').attrThen('href', getIdAt(3))
                    const name = el.find('.playerCol a').text()
                    const player = { name, id }

                    const teams = el
                        .find('.teamCol a')
                        .toArray()
                        .map((teamEl) => ({
                            id: teamEl.attrThen('href', getIdAt(3)),
                            name: teamEl.find('img').attr('title')
                        }))

                    const maps = el.find('td.statsDetail').eq(0).numFromText()!
                    const rounds = el.find('td.statsDetail').eq(1).numFromText()!
                    const kdDiff = el.find('td.kdDiffCol').numFromText()!
                    const kd = el.find('td.statsDetail').eq(2).numFromText()!
                    const rating = el.find('td.ratingCol').numFromText()!

                    return {
                        player,
                        teams,
                        maps,
                        kdDiff,
                        rounds,
                        kd,
                        ...($('.ratingCol .ratingDesc').text() === '2.0'
                            ? { rating2: rating }
                            : { rating1: rating })
                    }
                })
        }
