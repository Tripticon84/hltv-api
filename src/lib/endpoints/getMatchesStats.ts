import { stringify } from 'querystring';

import {
    HLTVConfig
} from '../config/configuration';

import {
    HLTVPage,
    HLTVScraper
} from '../utils/scraper';

import { 
    fromMapSlug, 
    toMapFilter 
} from '../types/shared/GameMap';
import { 
    Event 
} from '../types/shared/Event';
import { 
    GetMatchesStatsArguments, 
    MatchStatsPreview 
} from '../types/getMatchesStats';

import {
    fetchPage
} from '../utils/fetch';
import {
    getIdAt,
    sleep
} from '../utils/utils';

export const getMatchesStats =
    (config: HLTVConfig) =>
        async (
            options: GetMatchesStatsArguments = {}
        ): Promise<MatchStatsPreview[]> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
                ...(options.matchType ? { matchType: options.matchType } : {}),
                ...(options.maps ? { maps: options.maps.map(toMapFilter) } : {}),
                ...(options.rankingFilter
                    ? { rankingFilter: options.rankingFilter }
                    : {})
            })

            let page = 0
            let $: HLTVPage
            let matches: MatchStatsPreview[] = []

            do {
                await sleep(options.delayBetweenPageRequests ?? 0)

                $ = HLTVScraper(
                    await fetchPage(
                        `https://www.hltv.org/stats/matches?${query}&offset=${page * 50}`,
                        config.loadPage
                    )
                )

                page++

                matches.push(
                    ...$('.matches-table tbody tr')
                        .toArray()
                        .map((el) => {
                            const mapStatsId = Number(el
                                .find('.date-col a')
                                .attrThen('href', getIdAt(4)))
                            const date = el.find('.time').numFromAttr('data-unix')!
                            const map = fromMapSlug(
                                el.find('.dynamic-map-name-short').text()
                            )

                            const team1 = {
                                id: Number(el
                                    .find('.team-col a')
                                    .first()
                                    .attrThen('href', getIdAt(3))),
                                name: el.find('.team-col a').first().text()
                            }

                            const team2 = {
                                id: Number(el
                                    .find('.team-col a')
                                    .last()
                                    .attrThen('href', getIdAt(3))),
                                name: el.find('.team-col a').last().text()
                            }

                            const event: Event = {
                                id: Number(
                                    el
                                        .find('.event-col a')
                                        .attr('href')!
                                        .split('event=')[1]
                                        .split('&')[0]
                                ),
                                name: el.find('.event-col a').text()
                            }

                            const result = {
                                team1: Number(
                                    el
                                        .find('.team-col .score')
                                        .first()
                                        .trimText()!
                                        .replace(/\(|\)/g, '')
                                ),
                                team2: Number(
                                    el
                                        .find('.team-col .score')
                                        .last()
                                        .trimText()!
                                        .replace(/\(|\)/g, '')
                                )
                            }

                            return {
                                mapStatsId,
                                date,
                                map,
                                team1,
                                team2,
                                event,
                                result
                            }
                        })
                )
            } while ($('.matches-table tbody tr').exists())

            return matches
        }
