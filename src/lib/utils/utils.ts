import * as cheerio from 'cheerio';

import { 
    randomUUID 
} from 'crypto';

export const generateRandomSuffix = () => {
    return randomUUID();
};

export const percentageToDecimalOdd = (odd: number): number => parseFloat(((1 / odd) * 100).toFixed(2));

export function getIdAt(index: number, href: string): number | undefined;
export function getIdAt(index: number): (href: string) => number | undefined;
export function getIdAt(index?: number, href?: string): any {
    switch (arguments.length) {
        case 1:
            return (href: string) => getIdAt(index!, href);
        default:
            return parseNumber(href!.split('/')[index!]);
    }
}

export const notNull = <T>(x: T | null): x is T => x !== null;

export const parseNumber = (str: string | undefined): number | undefined => {
    if (!str) {
        return undefined;
    }

    const num = Number(str);
    return Number.isNaN(num) ? undefined : num;
};

export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};