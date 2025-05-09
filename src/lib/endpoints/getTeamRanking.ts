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
    GetTeamArguments,
    TeamRanking
} from '../types/getTeamRanking';

export const getTeamRanking =
    (config: HLTVConfig) =>
        async ({ year, month, day, country }: GetTeamArguments = {}): Promise<TeamRanking[]> => {
            let $ = HLTVScraper(
                await fetchPage(
                    `https://www.hltv.org/ranking/teams/${year ?? ''}/${month ?? ''}/${day ?? ''
                    }`,
                    config.loadPage
                )
            )

            if (country) {
                const redirectedLink = $('.ranking-country > a')
                    .first()
                    .attr('href')
                const countryRankingLink = redirectedLink
                    .split('/')
                    .slice(0, -1)
                    .concat(country)
                    .join('/')

                $ = HLTVScraper(
                    await fetchPage(
                        `https://www.hltv.org/${countryRankingLink}`,
                        config.loadPage
                    )
                )
            }

            const teams = $('.ranked-team')
                .toArray()
                .map((el) => {
                    const points = Number(
                        el
                            .find('.points')
                            .text()
                            .replace(/\(|\)/g, '')
                            .split(' ')[0]
                    )
                    const place = Number(el.find('.position').text().substring(1))

                    const team = {
                        name: el.find('.name').text(),
                        id: el.find('.moreLink').attrThen('href', getIdAt(2))
                    }

                    const changeText = el.find('.change').text()
                    const isNew = changeText === 'NEW TEAM'
                    const change =
                        changeText === '-' || isNew ? 0 : Number(changeText)

                    return { points, place, team, change, isNew }
                })

            return teams
        }
