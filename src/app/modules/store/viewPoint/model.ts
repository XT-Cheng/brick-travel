export enum ViewPointCategory {
    View,
    Food,
    Humanities,
    Transportation,
    Shopping,
    Lodging
}

export const VIEWPOINT_INITIAL_STATE: IViewPointResult = {
    items: [],
    loading: false,
    error: null,
  };

export interface IViewPoint {
    id: string,
    name: string;
    description: string;
    tips: string;
    timeNeeded: string;
    thumbnail: string;
    address: string;
    latitude: number;
    longtitude: number;
    category: ViewPointCategory;
    rank: number;
    images : string[];
    comments: IViewPointComment[];
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

export interface IViewPointResult {
    items: IViewPoint[];
    loading: boolean;
    error: Error;
}