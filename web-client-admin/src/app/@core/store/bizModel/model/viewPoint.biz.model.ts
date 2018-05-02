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
