import { ICity } from '../entity/city/city.model';
import { IViewPoint, IViewPointCategory } from '../entity/viewPoint/viewPoint.model';


export interface IViewPointBiz {
    id: string;
    name: string;
    city: ICity;
    description: string;
    tips: string;
    timeNeeded: string;
    thumbnail: string;
    address: string;
    latitude: number;
    longtitude: number;
    category: IViewPointCategory;
    rank: number;
    countOfComments: number;
    images: string[];
    tags: string[];
    comments: IViewPointCommentBiz[];
}

export interface IViewPointCommentBiz {
    id: string;
    detail: string;
    user: string;
    avatar: string;
    publishedAt: Date;
    images: string[];
    rate: number;
}

export function translateViewPointFromBiz(viewPoint: IViewPointBiz): IViewPoint {
    return {
        id: viewPoint.id,
        city: viewPoint.city.id,
        name: viewPoint.name,
        description: viewPoint.description,
        tips: viewPoint.tips,
        timeNeeded:  viewPoint.timeNeeded,
        thumbnail:  viewPoint.thumbnail,
        address: viewPoint.address,
        latitude: viewPoint.latitude,
        longtitude: viewPoint.longtitude,
        category: viewPoint.category.id,
        rank: viewPoint.rank,
        countOfComments: viewPoint.countOfComments,
        images: viewPoint.images.map((image) => image),
        tags: viewPoint.images.map((tag) => tag),
        comments: viewPoint.comments.map((comment) => comment.id)
    };
}
