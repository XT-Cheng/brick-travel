import { ViewPointCategory } from "../entity/viewPoint/viewPoint.model";
import { ICity } from "../entity/city/city.model";


export interface IViewPointBiz {
    id: string,
    name: string,
    city: ICity,
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
    comments: IViewPointCommentBiz[]
}

export interface IViewPointCommentBiz {
    id: string,
    detail: string,
    user: string,
    avatar: string,
    publishedAt: Date,
    images: string[],
    rate: number
}
