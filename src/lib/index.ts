import { defaultConfig, defaultLoadPage, HLTVConfig } from './config/configuration'

import { getMatch } from './endpoints/getMatch'
import { getMatches } from './endpoints/getMatches'
import { getEvent } from './endpoints/getEvent'
import { getEventByName } from './endpoints/getEventByName'
import { getEvents } from './endpoints/getEvents'
import { getMatchMapStats } from './endpoints/getMatchMapStats'
import { getMatchStats } from './endpoints/getMatchStats'
import { getMatchesStats } from './endpoints/getMatchesStats'
import { getPlayer } from './endpoints/getPlayer'
import { getPlayerByName } from './endpoints/getPlayerByName'
import { getPlayerRanking } from './endpoints/getPlayerRanking'
import { getPlayerStats } from './endpoints/getPlayerStats'
import { getRecentThreads } from './endpoints/getRecentThreads'
import { getStreams } from './endpoints/getStreams'
import { getTeam } from './endpoints/getTeam'
import { getTeamByName } from './endpoints/getTeamByName'
import { getTeamRanking } from './endpoints/getTeamRanking'
import { getTeamStats } from './endpoints/getTeamStats'
import { getPastEvents } from './endpoints/getPastEvents'
import { getResults } from './endpoints/getResults'
import { getNews } from './endpoints/getNews'

import { MatchStatus } from './types/getMatch'
import type {
    Demo,
    Highlight,
    Veto,
    HeadToHeadResult,
    ProviderOdds,
    MapHalfResult,
    MapResult,
    Stream,
    FullMatch as Match
} from './types/getMatch'

import { MatchEventType, MatchFilter } from './types/getMatches'
import type { MatchPreview, GetMatchesArguments } from './types/getMatches'

import type {
    FullEvent,
    FullEventHighlight,
    FullEventFormat,
    FullEventPrizeDistribution,
    FullEventTeam
} from './types/getEvent'

import type { EventPreview, GetEventsArguments } from './types/getEvents'
import type { FullMatchStats } from './types/getMatchStats'
import type { GetMatchesStatsArguments, MatchStatsPreview } from './types/getMatchesStats'
import type { FullPlayerTeam, PlayerAchievement, FullPlayer } from './types/getPlayer'
import type { PlayerRanking, GetPlayerRankingOptions } from './types/getPlayerRanking'
import type { FullPlayerStats, GetPlayerStatsArguments } from './types/getPlayerStats'
import { ThreadCategory } from './types/getRecentThreads'
import type { Thread } from './types/getRecentThreads'
import { StreamCategory } from './types/getStreams'
import type { FullStream } from './types/getStreams'
import { TeamPlayerType } from './types/getTeam'
import type { FullTeam, FullTeamPlayer } from './types/getTeam'
import type { TeamRanking, GetTeamArguments } from './types/getTeamRanking'
import type { TeamMapStats, TeamStatsEvent } from './types/getTeamStats'
import type { GetPastEventsArguments } from './types/getPastEvents'
import { ResultsMatchType, ContentFilter, GameType } from './types/getResult'
import type { FullMatchResult, ResultTeam, GetResultsArguments } from './types/getResult'
import type { NewsPreview, GetNewsArguments } from './types/getNews'

import { GameMap } from './types/shared/GameMap'
import { MatchFormat } from './types/shared/MatchFormat'
import { RankingFilter } from './types/shared/RankingFilter'
import { MatchType } from './types/shared/MatchType'
import { BestOfFilter } from './types/shared/BestOfFilter'
import type { Article } from './types/shared/Article'
import type { Country } from './types/shared/Country'
import type { Event } from './types/shared/Event'
import type { Player } from './types/shared/Player'
import type { Team } from './types/shared/Team'
import type { EventType } from './types/shared/EventType'

export class Hltv {
    public readonly TEAM_PLACEHOLDER_IMAGE = 'https://www.hltv.org/img/static/team/placeholder.svg'
    public readonly PLAYER_PLACEHOLDER_IMAGE = 'https://static.hltv.org/images/playerprofile/bodyshot/unknown.png'

    constructor(private config: Partial<HLTVConfig> = {}) {
        this.initializeConfig()
    }

    private initializeConfig() {
        if (this.config.httpAgent && !this.config.loadPage) {
            this.config.loadPage = defaultLoadPage(this.config.httpAgent)
        }

        if (!this.config.httpAgent) {
            this.config.httpAgent = defaultConfig.httpAgent
        }

        if (!this.config.loadPage) {
            this.config.loadPage = defaultConfig.loadPage
        }
    }

    getMatch = getMatch(this.config as HLTVConfig)
    getMatches = getMatches(this.config as HLTVConfig)
    getMatchMapStats = getMatchMapStats(this.config as HLTVConfig)
    getMatchStats = getMatchStats(this.config as HLTVConfig)
    getMatchesStats = getMatchesStats(this.config as HLTVConfig)
    getResults = getResults(this.config as HLTVConfig)

    getEvent = getEvent(this.config as HLTVConfig)
    getEvents = getEvents(this.config as HLTVConfig)
    getPastEvents = getPastEvents(this.config as HLTVConfig)
    getEventByName = getEventByName(this.config as HLTVConfig)

    getPlayer = getPlayer(this.config as HLTVConfig)
    getPlayerByName = getPlayerByName(this.config as HLTVConfig)
    getPlayerRanking = getPlayerRanking(this.config as HLTVConfig)
    getPlayerStats = getPlayerStats(this.config as HLTVConfig)

    getTeam = getTeam(this.config as HLTVConfig)
    getTeamByName = getTeamByName(this.config as HLTVConfig)
    getTeamRanking = getTeamRanking(this.config as HLTVConfig)
    getTeamStats = getTeamStats(this.config as HLTVConfig)

    getRecentThreads = getRecentThreads(this.config as HLTVConfig)
    getStreams = getStreams(this.config as HLTVConfig)
    getNews = getNews(this.config as HLTVConfig)

    public createInstance(config: Partial<HLTVConfig>) {
        return new Hltv(config)
    }
}

const hltv = new Hltv()
export default hltv
export { hltv as HLTV }

export {
    MatchStatus,
    MatchEventType,
    MatchFilter,
    MatchFormat,
    MatchType,
    BestOfFilter,
    ResultsMatchType,
    ContentFilter,
    GameType,

    ThreadCategory,
    StreamCategory,
    TeamPlayerType,
    GameMap,
    RankingFilter,

    type Demo,
    type Highlight,
    type Veto,
    type HeadToHeadResult,
    type ProviderOdds,
    type MapHalfResult,
    type MapResult,
    type Stream,
    type Match,
    type MatchPreview,
    type GetMatchesArguments,
    type FullEvent,
    type FullEventHighlight,
    type FullEventFormat,
    type FullEventPrizeDistribution,
    type FullEventTeam,
    type EventPreview,
    type GetEventsArguments,
    type FullMatchStats,
    type GetMatchesStatsArguments,
    type MatchStatsPreview,
    type FullPlayerTeam,
    type PlayerAchievement,
    type FullPlayer,
    type PlayerRanking,
    type GetPlayerRankingOptions,
    type FullPlayerStats,
    type GetPlayerStatsArguments,
    type Thread,
    type FullStream,
    type FullTeam,
    type FullTeamPlayer,
    type TeamRanking,
    type GetTeamArguments,
    type TeamMapStats,
    type TeamStatsEvent,
    type GetPastEventsArguments,
    type FullMatchResult,
    type ResultTeam,
    type GetResultsArguments,
    type NewsPreview,
    type GetNewsArguments,
    type Article,
    type Country,
    type Event,
    type Player,
    type Team,
    type EventType
}