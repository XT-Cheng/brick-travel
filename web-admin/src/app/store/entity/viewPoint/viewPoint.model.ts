export enum ViewPointCategory {
    View,
    Food,
    Humanities,
    Transportation,
    Shopping,
    Lodging
}

export interface IViewPoint {
    id: string,
    city: string,
    name: string,
    description: string,
    tips: string,
    timeNeeded: string,
    thumbnail: string,
    address: string,
    latitude: number,
    longtitude: number,
    category: ViewPointCategory,
    rank: number,
    countOfComments: number,
    images : string[],
    tags: string[],
    comments: string[],
}

export interface IViewPointComment {
    id: string,
    detail: string,
    user: string,
    avatar: string,
    publishedAt: Date,
    images: string[],
    rate: number
}
