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
    getIdAt,
    parseNumber
} from '../utils/utils';
import {
    fetchPage
} from '../utils/fetch';

export const getEvents = (config: HLTVConfig) =>
    async () => {
        const $ = HLTVScraper(
            await fetchPage(
                `https://www.hltv.org/events`,
                config.loadPage
            )
        );

        const featuredOngoingEvents = $('a.ongoing-event').toArray().map((el) => {
            const href = el.attr('href');
            return href ? getIdAt(2, href) : null;
        });

        const ongoingEvents = $('.tab-content[id="ALL"] a.ongoing-event').toArray().map((el) => {
            const id = el.attrThen('href', getIdAt(2))!;
            const name = el.find('.event-name-small .text-ellipsis').text();

            const dateStart = el.find('tr.eventDetails span[data-unix]').first().numFromAttr('data-unix')!;
            const dateEnd = el.find('tr.eventDetails span[data-unix]').last().numFromAttr('data-unix')!;

            const featured = featuredOngoingEvents.includes(id);

            return {
                id,
                name,
                dateStart,
                dateEnd,
                featured
            };
        });

        const bigUpcomingEvents = $('a.big-event').toArray().map((el) => {
            const id = el.attrThen('href', getIdAt(2))!;
            const name = el.find('.big-event-name').text();

            const dateStart = el.find('.additional-info .col-date span[data-unix]').first().numFromAttr('data-unix')!;
            const dateEnd = el.find('.additional-info .col-date span[data-unix]').last().numFromAttr('data-unix')!;

            const locationName = el.find('.big-event-location').text();

            const location = locationName !== 'TBA' ? {
                name: locationName,
                code: el.find('.location-top-teams img.flag').attr('src').split('/').pop()!.split('.')[0]
            } : undefined;

            const prizePool = el.find('.additional-info tr').first().find('td').eq(1).text();

            const numberOfTeams = parseNumber(el.find('.additional-info tr').first().find('td').eq(2).text());

            return {
                id,
                name,
                dateStart,
                dateEnd,
                location,
                prizePool,
                numberOfTeams,
                featured: true
            };
        });

        const smallUpcomingEvents = $('a.small-event').toArray().map((el) => {
            const id = el.attrThen('href', getIdAt(2))!;
            const name = el.find('.table tr').first().find('td').first().find('.text-ellipsis').text();

            const dateStart = el.find('td span[data-unix]').first().numFromAttr('data-unix')!;
            const dateEnd = el.find('td span[data-unix]').last().numFromAttr('data-unix')!;

            const location = {
                name: el.find('.smallCountry .col-desc').text().replace(' | ', ''),
                code: el.find('.smallCountry img.flag').attr('src').split('/').pop()!.split('.')[0]
            };

            const prizePool = el.find('.prizePoolEllipsis').text();

            const numberOfTeams = parseNumber(el.find('.prizePoolEllipsis').prev().text());

            return {
                id,
                name,
                dateStart,
                dateEnd,
                location,
                prizePool,
                numberOfTeams,
                featured: false
            };
        });

        return ongoingEvents.concat(bigUpcomingEvents).concat(smallUpcomingEvents);
    };
