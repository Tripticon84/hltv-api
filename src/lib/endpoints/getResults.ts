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
    notNull,
    sleep
} from '../utils/utils';
import {
    fetchPage
} from '../utils/fetch';

import {
    fromMapSlug,
    toMapFilter
} from '../types/shared/GameMap';
import {
    GetResultsArguments,
    FullMatchResult
} from '../types/getResult';

export const getResults =
    (config: HLTVConfig) =>
        async (options: GetResultsArguments): Promise<FullMatchResult[]> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
                ...(options.matchType ? { matchType: options.matchType } : {}),
                ...(options.maps ? { map: options.maps.map(toMapFilter) } : {}),
                ...(options.bestOfX ? { bestOfX: options.bestOfX } : {}),
                ...(options.countries ? { country: options.countries } : {}),
                ...(options.contentFilters
                    ? { content: options.contentFilters }
                    : {}),
                ...(options.eventIds ? { event: options.eventIds } : {}),
                ...(options.playerIds ? { player: options.playerIds } : {}),
                ...(options.teamIds ? { team: options.teamIds } : {}),
                ...(options.game ? { gameType: options.game } : {}),
                ...(options.stars ? { stars: options.stars } : {})
            })

            let page = 0
            let $: HLTVPage
            let results: FullMatchResult[] = []

            do {
                await sleep(options.delayBetweenPageRequests ?? 0)

                $ = HLTVScraper(
                    await fetchPage(
                        `https://www.hltv.org/results?${query}&offset=${page * 100}`,
                        config.loadPage
                    )
                )

                page++

                let featuredResults = $('.big-results .result-con')
                    .toArray()
                    .map((el) => el.children().first().attrThen('href', getIdAt(2)))

                results.push(
                    ...$('.result-con')
                        .toArray()
                        .map((el) => {
                            try {
                                const id = el
                                    .children()
                                    .first()
                                    .attrThen('href', getIdAt(2))!

                                if (featuredResults.includes(id)) {
                                    featuredResults = featuredResults.filter(
                                        (x) => x !== id
                                    )
                                    return null
                                }
                                const stars = el.find('.stars i').length
                                const date = el.numFromAttr(
                                    'data-zonedgrouping-entry-unix'
                                )!
                                const eventName = el.find('.event-name').text()
                                const format = el.find('.map-text').text()

                                const team1 = {
                                    name: el.find('div.team').first().text(),
                                    logo: el.find('img.team-logo').first().attr('src')
                                }

                                const team2 = {
                                    name: el.find('div.team').last().text(),
                                    logo: el.find('img.team-logo').last().attr('src')
                                }

                                const event = {
                                    name: el.find('.event-name').text(),
                                    logo: el.find('img.event-logo').first().attr('src')
                                }

                                // Try different selectors for the result score
                                const resultScoreElement = el.find('.result-score, .score-won, .score-lost');
                                const resultScoreText = resultScoreElement.text().trim();
                                
                                console.log(`Processing match ${id}:`);
                                console.log(`- Result score element exists: ${resultScoreElement.length > 0}`);
                                console.log(`- Result score text: "${resultScoreText}"`);
                                
                                if (!resultScoreText) {
                                    console.warn(`No result score found for match ${id}`);
                                    return null;
                                }

                                const scoreParts = resultScoreText.split(' - ');
                                console.log(`- Score parts: ${JSON.stringify(scoreParts)}`);
                                
                                if (scoreParts.length !== 2) {
                                    console.warn(`Invalid score format for match ${id}: ${resultScoreText}`);
                                    return null;
                                }

                                const [team1Result, team2Result] = scoreParts.map(Number);

                                if (isNaN(team1Result) || isNaN(team2Result)) {
                                    console.warn(`Invalid score numbers for match ${id}: ${resultScoreText}`);
                                    return null;
                                }

                                return {
                                    id,
                                    stars,
                                    date,
                                    event,
                                    team1,
                                    team2,
                                    result: { team1: team1Result, team2: team2Result },
                                    ...(format.includes('bo')
                                        ? { format }
                                        : { map: fromMapSlug(format), format: 'bo1' })
                                }
                            } catch (error) {
                                console.error(`Error processing match result: ${error}`);
                                return null;
                            }
                        })
                        .filter(notNull)
                )
            } while ($('.result-con').exists())

            return results
        }
