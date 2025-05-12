import {
    HLTVConfig
} from '../config/configuration';

import {
    HLTVScraper
} from '../utils/scraper';
import {
    generateRandomSuffix,
    getIdAt,
    parseNumber
} from '../utils/utils';
import {
    fetchPage
} from '../utils/fetch';

import {
    FullTeam,
    TeamPlayerType
} from '../types/getTeam';

export const getTeam =
    (config: HLTVConfig) =>
        async ({ id }: { id: number }): Promise<FullTeam> => {
            const $ = HLTVScraper(
                await fetchPage(
                    `https://www.hltv.org/team/${id}/${generateRandomSuffix()}`,
                    config.loadPage
                )
            )

            const name = $('.profile-team-name').text()
            const logoSrc = $('.teamlogo').attr('src')
            const logo = logoSrc.includes('placeholder.svg') ? undefined : logoSrc
            const facebook = $('.facebook').parent().attr('href')
            const twitter = $('.twitter').parent().attr('href')
            const instagram = $('.instagram').parent().attr('href')
            const rank = parseNumber(
                $('.profile-team-stat .right').first().text().replace('#', '')
            )

            const players = $('.players-table tbody tr')
                .toArray()
                .map((el) => ({
                    name: el
                        .find(
                            '.playersBox-playernick-image .playersBox-playernick .text-ellipsis'
                        )
                        .text(),
                    id: Number(el
                        .find('.playersBox-playernick-image')
                        .attrThen('href', getIdAt(2))),
                    timeOnTeam: el.find('td').eq(2).trimText()!,
                    mapsPlayed: el.find('td').eq(3).numFromText()!,
                    type: getPlayerType(el.find('.player-status').text())!
                }))
                .concat(
                    ...($('.coach-table').exists()
                        ? [
                            {
                                id: Number($(
                                    '.coach-table .playersBox-playernick-image'
                                ).attrThen('href', getIdAt(2))),
                                name: $(
                                    '.coach-table .playersBox-playernick-image .playersBox-playernick .text-ellipsis'
                                ).text(),
                                timeOnTeam: $('.coach-table tbody tr')
                                    .first()
                                    .find('td')
                                    .eq(1)
                                    .trimText()!,
                                mapsPlayed: $('.coach-table tbody tr')
                                    .first()
                                    .find('td')
                                    .eq(2)
                                    .numFromText()!,
                                type: TeamPlayerType.Coach
                            }
                        ]
                        : [])
                )

            let rankingDevelopment

            try {
                const rankings = JSON.parse(
                    $('.graph').attr('data-fusionchart-config')!
                )
                rankingDevelopment = rankings.dataSource.dataset[0].data.map(
                    (x: any) => parseNumber(x.value)
                )
            } catch {
                rankingDevelopment = []
            }

            const country = {
                name: $('.team-country .flag').attr('alt'),
                code: $('.team-country .flag').attrThen(
                    'src',
                    (x) => x.split('/').pop()?.split('.')[0]!
                )
            }

            const news = $('#newsBox a')
                .toArray()
                .map((el) => ({
                    name: el.contents().eq(1).text(),
                    link: el.attr('href')
                }))

            return {
                id,
                name,
                logo,
                facebook,
                twitter,
                instagram,
                country,
                rank,
                players,
                rankingDevelopment,
                news
            }
        }

function getPlayerType(text: string): TeamPlayerType | undefined {
    if (text === 'STARTER') {
        return TeamPlayerType.Starter
    }
    if (text === 'BENCHED') {
        return TeamPlayerType.Benched
    }
    if (text === 'SUBSTITUTE') {
        return TeamPlayerType.Substitute
    }
}
