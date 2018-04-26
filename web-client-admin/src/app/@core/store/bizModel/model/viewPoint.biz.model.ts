import { IViewPoint, IViewPointCategory } from '../../entity/model/viewPoint.model';
import { IBiz } from '../biz.model';
import { ICityBiz } from './city.biz.model';

export interface IViewPointCategoryBiz extends IBiz {
    name: string;
}

export interface IViewPointBiz extends IBiz {
    name: string;
    city: ICityBiz;
    description: string;
    tips: string;
    timeNeeded: string;
    thumbnail: string;
    address: string;
    latitude: number;
    longtitude: number;
    category: IViewPointCategoryBiz;
    rank: number;
    countOfComments: number;
    images: string[];
    tags: string[];
    comments: IViewPointCommentBiz[];
}

export interface IViewPointCommentBiz extends IBiz {
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
        timeNeeded: viewPoint.timeNeeded,
        thumbnail: viewPoint.thumbnail,
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

export function translateViewPointCategoryFromBiz(viewPoint: IViewPointCategoryBiz): IViewPointCategory {
    return {
        id: viewPoint.id,
        name: viewPoint.name,
    };
}
