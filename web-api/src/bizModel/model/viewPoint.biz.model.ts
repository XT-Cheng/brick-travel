import { ViewPointCategory } from "../../modules/store/entity/viewPoint/viewPoint.model";


export interface IViewPointBiz {
    id: string,
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
    images : string[],
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
