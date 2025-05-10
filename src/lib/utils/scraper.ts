import * as cheerio from 'cheerio';

import { 
    CheerioAPI 
} from 'cheerio';

import { 
    parseNumber 
} from './utils';

export interface HLTVPage extends CheerioAPI {
    (selector: string): HLTVPageElement;
};

export interface HLTVPageElement {
    length: number;
    
    trimText(): string | undefined;
    numFromAttr(attr: string): number | undefined;
    numFromText(): number | undefined;
    lines(): string[];
    exists(): boolean;
    find(selector: string): HLTVPageElement;
    attr(attr: string): string;
    text(): string;
    textThen<T>(then: (value: string) => T): T;
    first(): HLTVPageElement;
    last(): HLTVPageElement;
    toArray(): HLTVPageElement[];
    data(name: string): any;
    attrThen<T>(attr: string, then: (value: string) => T): T;
    next(selector?: string): HLTVPageElement;
    eq(index: number): HLTVPageElement;
    parent(): HLTVPageElement;
    children(selector?: string): HLTVPageElement;
    prev(selector?: string): HLTVPageElement;
    contents(): HLTVPageElement;
    index(): number;
    filter(func: (index: number, element: HLTVPageElement) => boolean): HLTVPageElement;
}

const attachMethods = (root: cheerio.Cheerio<any>): HLTVPageElement => {
    return {
        length: root.length,

        find(selector: string): HLTVPageElement {
            return attachMethods(root.find(selector));
        },

        attr(attr: string): string {
            const value = root.attr(attr);
            return value || '';
        },

        attrThen<T>(attr: string, then: (value: string) => T): T {
            const value = root.attr(attr);
            return then(value || '');
        },

        text(): string {
            return root.text();
        },

        textThen<T>(then: (value: string) => T): T {
            return then(root.text());
        },

        first(): HLTVPageElement {
            return attachMethods(root.first());
        },

        last(): HLTVPageElement {
            return attachMethods(root.last());
        },

        data(name: string): any {
            return root.data(name);
        },

        trimText(): string | undefined {
            const text = root.text().trim();
            return text || undefined;
        },

        numFromAttr(attr: string): number | undefined {
            return parseNumber(root.attr(attr));
        },

        numFromText(): number | undefined {
            return parseNumber(root.text());
        },

        lines(): string[] {
            return root.text().split('\n');
        },

        exists(): boolean {
            return root.length !== 0;
        },

        toArray(): HLTVPageElement[] {
            return root.toArray().map(el => {
                const $ = cheerio.load(el);
                return attachMethods($('*'));
            });
        },

        prev(selector?: string): HLTVPageElement {
            return attachMethods(root.prev(selector));
        },

        next(selector?: string): HLTVPageElement {
            return attachMethods(root.next(selector));
        },

        eq(index: number): HLTVPageElement {
            return attachMethods(root.eq(index));
        },

        children(selector?: string): HLTVPageElement {
            return attachMethods(root.children(selector));
        },

        parent(): HLTVPageElement {
            return attachMethods(root.parent());
        },

        contents(): HLTVPageElement {
            return attachMethods(root.contents());
        },

        filter(func: (index: number, element: HLTVPageElement) => boolean): HLTVPageElement {
            return attachMethods(
                root.filter((i, el) => {
                    const $ = cheerio.load(el);
                    return func(i, attachMethods($('*')));
                })
            );
        },

        index(): number {
            return root.index();
        }
    };
};

export const HLTVScraper = (root: CheerioAPI): HLTVPage => {
    const selector = (selector: string): HLTVPageElement => {
        return attachMethods(root(selector));
    };
    
    Object.assign(selector, root);
    return selector as HLTVPage;
};