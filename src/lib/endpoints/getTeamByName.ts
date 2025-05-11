import {
    HLTVConfig
} from '../config/configuration';

import {
    FullTeam
} from '../types/getTeam';

import {
    getTeam
} from './getTeam';

import {
    formatTeamName
} from '../utils/formatters';

export const getTeamByName =
    (config: HLTVConfig) =>
        async ({ name }: { name: string }): Promise<FullTeam> => {
            const formattedName = formatTeamName(name);
            const pageContent = await config.loadPage!(`https://www.hltv.org/search?term=${formattedName}`);

            const jsonMatch = pageContent.match(/<pre>(\[.*?\])<\/pre>/s);
            if (!jsonMatch) {
                throw new Error(`Failed to parse search results for team ${name}`);
            }

            const searchResults = JSON.parse(jsonMatch[1]);
            const firstTeam = searchResults[0]?.teams?.[0];

            if (!firstTeam) {
                throw new Error(`Team ${name} not found`);
            }

            return getTeam(config)({ id: firstTeam.id });
        }
