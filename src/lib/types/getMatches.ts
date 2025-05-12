import { Team } from './shared/Team';
import { Event } from './shared/Event';

export enum MatchEventType {
    All = 'All',
    LAN = 'Lan',
    Online = 'Online'
};

export enum MatchFilter {
    LanOnly = 'lan_only',
    TopTier = 'top_tier'
};

export interface GetMatchesArguments {
    selectedDate?: string;
};

export interface MatchPreview {
    id: number;
    team1?: Team;
    team2?: Team;
    date?: number;
    format?: string;
    event?: Event;
    title?: string;
    live: boolean;
    stars: number;
};