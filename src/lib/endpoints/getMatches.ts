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
    MatchPreview,
    GetMatchesArguments
} from '../types/getMatches';

function parseEvents($: any) {
    return $('.event-headline-wrapper').toArray().map((el: any) => {
        const id = Number(el.attr('data-event-id'));
        const name = el.attr('data-event-headline');

        return { id, name };
    });
}

function parseMatch(el: any, events: any[]) {
    const id = Number(el.attr('data-match-id'));
    const stars = Number(el.attr('data-stars'));
    const eventId = Number(el.attr('data-event-id'));
    const event = events.find((e) => e.id === eventId);
    const date = el.find('.match-time').numFromAttr('data-unix');
    const format = el.find('.match-meta:nth-child(2)').text();
    const stage = el.find('.match-stage').text();

    const lineClampEl = el.find('.line-clamp-3');
    const hasNoInfo = lineClampEl.length > 0;

    let team1 = null;
    let team2 = null;
    let infoMessage = undefined;

    if (!hasNoInfo) {
        const teamsBlock = el.find('.match-teams');
        const teamDivs = teamsBlock.find('.match-team');
        const team1Div = teamDivs.eq(0);
        const team2Div = teamDivs.eq(1);

        team1 = {
            name: team1Div.find('.match-teamname').text(),
            logo: team1Div.find('img.match-team-logo').attr('src')
        };
        team2 = {
            name: team2Div.find('.match-teamname').text(),
            logo: team2Div.find('img.match-team-logo').attr('src')
        };
    } else {
        infoMessage = lineClampEl.text();
    }

    return {
        id,
        date,
        stars,
        format,
        stage: stage.length > 0 ? stage : null,
        event,
        team1,
        team2,
        ...(infoMessage ? { infoMessage } : {})
    };
}

function getLiveMatches($: any, events: any[]) {
    return $('.match-wrapper[live="true"]').toArray().map((el: any) => parseMatch(el, events));
}

function getUpcomingMatches($: any, events: any) {
    return $('.matches-event-wrapper').toArray().slice(1).map((champEl: any) => {
        const matches = champEl.find('.match-wrapper[live!="true"]').toArray().map((el: any) => parseMatch(el, events));
        console.log(matches[0]);
        const event = matches.length > 0 && matches[0].event
            ? { id: matches[0].event.id, name: matches[0].event.name }
            : { id: null, name: '' };
        return { event, matches };
    });
}

export interface UpcomingMatchesByChampionship {
    event: { id: number | undefined, name: string };
    matches: MatchPreview[];
}

export interface MatchesResult {
    liveMatches: MatchPreview[];
    upcomingMatchesByChampionship: UpcomingMatchesByChampionship[];
}

export const getMatches =
    (config: HLTVConfig) =>
        async (options: GetMatchesArguments = {}): Promise<MatchesResult> => {
            const $ = HLTVScraper(
                await fetchPage(
                    `https://www.hltv.org/matches?selectedDate=${options.selectedDate}`,
                    config.loadPage
                )
            );

            const events = parseEvents($);
            const liveMatches = getLiveMatches($, events);
            const upcomingMatchesByChampionship = getUpcomingMatches($, events);

            return {
                liveMatches,
                upcomingMatchesByChampionship
            };
        }
