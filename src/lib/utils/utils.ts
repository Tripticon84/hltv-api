import { 
    randomUUID 
} from 'crypto';

export const generateRandomSuffix = () => {
    return randomUUID();
};

export const percentageToDecimalOdd = (odd: number): number => parseFloat(((1 / odd) * 100).toFixed(2));

export function getIdAt(index?: number, href?: string): any {
    if (arguments.length === 1) {
        return (href: string) => getIdAt(index!, href);
    }

    if (!href) {
        throw new Error('href parameter is required');
    }

    if (typeof index !== 'number') {
        throw new Error('index parameter must be a number');
    }

    const parts = href.split('/');
    if (index >= parts.length) {
        throw new Error(`Index ${index} is out of bounds for the given href`);
    }

    return parseNumber(parts[index]);
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