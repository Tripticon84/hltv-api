import HLTV from '../lib';

export class HltvService {
    // Match related methods
    async getMatches(params: {
        selectedDate?: string;
    }) {
        try {
            const matches = await HLTV.getMatches(params);
            return matches;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch matches: ${error.message}`);
            }
            throw new Error('Failed to fetch matches: Unknown error occurred');
        }
    }

    async getResults(params: {
        eventIds?: number[];
        bestOfX?: BestOfFilter;
    } = {}) {
        try {
            const results = await HLTV.getResults(params);
            return results;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch results: ${error.message}`);
            }
            throw new Error('Failed to fetch results: Unknown error occurred');
        }
    }

    async getMatchById(id: number) {
        try {
            const match = await HLTV.getMatch({ id });
            return match;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch match with ID ${id}: ${error.message}`);
            }
            throw new Error(`Failed to fetch match with ID ${id}: Unknown error occurred`);
        }
    }

    // Team related methods
    async getTeamById(id: number) {
        try {
            const team = await HLTV.getTeam({ id });
            return team;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch team with ID ${id}: ${error.message}`);
            }
            throw new Error(`Failed to fetch team with ID ${id}: Unknown error occurred`);
        }
    }

    async getTeamStats(id: number) {
        try {
            const stats = await HLTV.getTeamStats({ id });
            return stats;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch team stats for ID ${id}: ${error.message}`);
            }
            throw new Error(`Failed to fetch team stats for ID ${id}: Unknown error occurred`);
        }
    }

    async getTeamByName(name: string) {
        try {
            const team = await HLTV.getTeamByName({ name });
            return team;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch team with name ${name}: ${error.message}`);
            }
            throw new Error(`Failed to fetch team with name ${name}: Unknown error occurred`);
        }
    }

    // Player related methods
    async getPlayerById(id: number) {
        try {
            const player = await HLTV.getPlayer({ id });
            return player;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch player with ID ${id}: ${error.message}`);
            }
            throw new Error(`Failed to fetch player with ID ${id}: Unknown error occurred`);
        }
    }

    async getPlayerStats(id: number) {
        try {
            const stats = await HLTV.getPlayerStats({ id });
            return stats;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch player stats for ID ${id}: ${error.message}`);
            }
            throw new Error(`Failed to fetch player stats for ID ${id}: Unknown error occurred`);
        }
    }

    // Event related methods
    async getEventById(id: number) {
        try {
            const event = await HLTV.getEvent({ id });
            return event;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch event with ID ${id}: ${error.message}`);
            }
            throw new Error(`Failed to fetch event with ID ${id}: Unknown error occurred`);
        }
    }

    async getEvents() {
        try {
            const events = await HLTV.getEvents();
            return events;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch events: ${error.message}`);
            }
            throw new Error('Failed to fetch events: Unknown error occurred');
        }
    }

    // News related methods
    async getNews(params: {
        year?: 2005 | 2006 | 2007 | 2008 | 2009 | 2010 | 2011 | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022;
        month?: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';
        eventIds?: number[];
    } = {}) {
        try {
            const news = await HLTV.getNews(params);
            return news;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch news: ${error.message}`);
            }
            throw new Error('Failed to fetch news: Unknown error occurred');
        }
    }

    // Rankings related methods
    async getTeamRanking(params: {
        year?: 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022;
        month?: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';
        day?: number;
    } = {}) {
        try {
            const ranking = await HLTV.getTeamRanking(params);
            return ranking;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch team ranking: ${error.message}`);
            }
            throw new Error('Failed to fetch team ranking: Unknown error occurred');
        }
    }

    async getPlayerRanking(params: {
        startDate?: string;
        endDate?: string;
        matchType?: MatchType;
        rankingFilter?: RankingFilter;
        maps?: GameMap[];
        minMapCount?: number;
        countries?: string[];
        bestOfX?: BestOfFilter;
    } = {}) {
        try {
            const ranking = await HLTV.getPlayerRanking(params);
            return ranking;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch player ranking: ${error.message}`);
            }
            throw new Error('Failed to fetch player ranking: Unknown error occurred');
        }
    }
}

// Export a default instance
export const hltvService = new HltvService();

// Export types
export type Match = Awaited<ReturnType<typeof HLTV.getMatch>>;
export type Team = Awaited<ReturnType<typeof HLTV.getTeam>>;
export type Player = Awaited<ReturnType<typeof HLTV.getPlayer>>;
export type Event = Awaited<ReturnType<typeof HLTV.getEvent>>;

export enum BestOfFilter {
    'BO1' = "BestOf1",
    'BO3' = "BestOf3",
    'BO5' = "BestOf5"
};

export enum MatchType {
    LAN = "Lan",
    Online = "Online",
    BigEvents = "BigEvents",
    Majors = "Majors"
}

export enum RankingFilter {
    Top5 = "Top5",
    Top10 = "Top10",
    Top20 = "Top20",
    Top30 = "Top30",
    Top50 = "Top50"
}

export enum GameMap {
    TBA = "tba",
    Train = "de_train",
    Cobblestone = "de_cbble",
    Inferno = "de_inferno",
    Cache = "de_cache",
    Mirage = "de_mirage",
    Overpass = "de_overpass",
    Dust2 = "de_dust2",
    Nuke = "de_nuke",
    Tuscan = "de_tuscan",
    Vertigo = "de_vertigo",
    Season = "de_season",
    Ancient = "de_ancient",
    Anubis = "de_anubis",
    Default = "default"
}