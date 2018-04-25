import { IViewPoint, IViewPointCategory } from '../../store.v0/entity/viewPoint/viewPoint.model';
import { ICity } from './model/city.model';
import { IFilterCategory, IFilterCriteria } from './model/filterCategory.model';
import { IUser } from './model/user.model';
import { IViewPointComment } from './model/viewPoint.model';

export enum EntityTypeEnum {
    CITY = 'CITY',
    VIEWPOINT = 'VIEWPOINT',
    USER = 'USER',
    FILTERCATEGORY = 'FILTERCATEGORY',
    MASTER_DATA = 'MASTER_DATA'
}

export enum STORE_ENTITIES_KEY {
    cities = 'cities',
    viewPoints = 'viewPoints',
    viewPointComments = 'viewPointComments',
    viewPointCatgories = 'viewPointCatgories',
    users = 'users',
    filterCategories = 'filterCategories',
    filterCriteries = 'filterCriteries',
}

export interface IEntity {
    id: string;
}

export interface IEntities {
    cities: { [id: string]: ICity };
    viewPoints: { [id: string]: IViewPoint };
    viewPointCatgories: { [id: string]: IViewPointCategory };
    viewPointComments: { [id: string]: IViewPointComment };
    users: { [id: string]: IUser };
    filterCategories: { [id: string]: IFilterCategory };
    filterCriteries: { [id: string]: IFilterCriteria };
}

export const INIT_ENTITY_STATE: IEntities = {
    cities: {},
    viewPoints: {},
    viewPointCatgories: {},
    viewPointComments: {},
    users: {},
    filterCategories: {},
    filterCriteries: {},
};

// {} |
