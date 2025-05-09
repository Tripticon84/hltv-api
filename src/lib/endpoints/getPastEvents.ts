import {
    stringify
} from 'querystring';

import {
    HLTVConfig
} from '../config/configuration';

import {
    HLTVPage,
    HLTVScraper
} from '../utils/scraper';
import {
    getIdAt,
    sleep
} from '../utils/utils';
import {
    fetchPage
} from '../utils/fetch'

import {
    fromText
} from '../types/shared/EventType';
import {
    PastEventPreview,
    GetPastEventsArguments
} from '../types/getPastEvents';

export const getPastEvents =
    (config: HLTVConfig) =>
        async (options: GetPastEventsArguments): Promise<PastEventPreview[]> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
                ...(options.eventType ? { eventType: options.eventType } : {}),
                ...(options.prizePoolMin ? { prizeMin: options.prizePoolMin } : {}),
                ...(options.prizePoolMax ? { prizeMax: options.prizePoolMax } : {}),
                ...(options.attendingTeamIds
                    ? { team: options.attendingTeamIds }
                    : {}),
                ...(options.attendingPlayerIds
                    ? { player: options.attendingPlayerIds }
                    : {})
            })

            let page = 0
            let $: HLTVPage
            let events: PastEventPreview[] = []

            do {
                await sleep(options.delayBetweenPageRequests ?? 0)

                $ = HLTVScraper(
                    await fetchPage(
                        `https://www.hltv.org/events/archive?${query}&offset=${page * 50}`,
                        config.loadPage
                    )
                )

                page++

                events.push(
                    ...$('a.small-event')
                        .toArray()
                        .map((el) => {
                            const id = el.attrThen('href', getIdAt(2))!
                            const name = el
                                .find('.table tr')
                                .first()
                                .find('td')
                                .first()
                                .find('.text-ellipsis')
                                .text()

                            const type = fromText(
                                el
                                    .find('.table tr')
                                    .first()
                                    .find('td')
                                    .last()
                                    .text()
                            )!

                            const dateStart = el
                                .find('td span[data-unix]')
                                .first()
                                .numFromAttr('data-unix')!

                            const dateEnd = el
                                .find('td span[data-unix]')
                                .last()
                                .numFromAttr('data-unix')!

                            const location = {
                                name: el
                                    .find('.smallCountry .col-desc')
                                    .text()
                                    .replace(' | ', ''),
                                code: el
                                    .find('.smallCountry img.flag')
                                    .attr('src')
                                    .split('/')
                                    .pop()!
                                    .split('.')[0]
                            }

                            const prizePool = el.find('.prizePoolEllipsis').text()
                            const numberOfTeams = Number(
                                el
                                    .find('.prizePoolEllipsis')
                                    .prev()
                                    .text()
                                    .replace('+', '')
                            )

                            return {
                                id,
                                name,
                                type,
                                dateStart,
                                dateEnd,
                                location,
                                prizePool,
                                numberOfTeams
                            }
                        })
                )
            } while ($('a.small-event').exists())

            return events
        }
