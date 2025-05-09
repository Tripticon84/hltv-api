export enum ThreadCategory {
    CS = 'cs',
    Match = 'match',
    News = 'news'
}

export interface Thread {
    title: string
    link: string
    replies: number
    category: ThreadCategory
}