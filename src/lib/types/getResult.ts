import { BestOfFilter } from "./shared/BestOfFilter"
import { GameMap } from "./shared/GameMap"

export enum ResultsMatchType {
    LAN = 'Lan',
    Online = 'Online'
}

export enum ContentFilter {
    HasHighlights = 'highlights',
    HasDemo = 'demo',
    HadVOD = 'vod',
    HasStats = 'stats'
}

export enum GameType {
    CSGO = 'CSGO',
    CS16 = 'CS16'
}

export interface ResultTeam {
    name: string
    logo: string
}

export interface ResultEvent {
    name: string
    logo: string
}

export interface FullMatchResult {
    id: number
    date: number
    team1: ResultTeam
    team2: ResultTeam
    event: ResultEvent
    stars: number
    format: string
    map?: GameMap
    result: {
        team1: number
        team2: number
    }
}

export interface GetResultsArguments {
    startDate?: string
    endDate?: string
    matchType?: ResultsMatchType
    maps?: GameMap[]
    bestOfX?: BestOfFilter
    countries?: string[]
    contentFilters?: ContentFilter[]
    eventIds?: number[]
    playerIds?: number[]
    teamIds?: number[]
    game?: GameType
    stars?: 1 | 2 | 3 | 4 | 5
    delayBetweenPageRequests?: number
}