import { Country } from "./shared/Country"

export enum StreamCategory {
    TopPlayer = 'Top player',
    Caster = 'Caster',
    FemalePlayer = 'Female Player'
}

export interface FullStream {
    name: string
    category: StreamCategory
    country: Country
    link: string
    viewers: number
}