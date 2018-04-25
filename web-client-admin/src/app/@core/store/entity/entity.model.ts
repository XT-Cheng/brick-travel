import { IViewPoint, IViewPointCategory } from '../../store.v0/entity/viewPoint/viewPoint.model';
import { ICity } from './model/city.model';
import { IUser } from './model/user.model';
import { IViewPointComment } from './model/viewPoint.model';

export enum STORE_ENTITIES_KEY {
    cities = 'cities',
    viewPoints = 'viewPoints',
    viewPointComments = 'viewPointComments',
    viewPointCatgories = 'viewPointCatgories',
    users = 'users'
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
}

export const INIT_ENTITY_STATE: IEntities = {
    cities: {},
    viewPoints: {},
    viewPointCatgories: {},
    viewPointComments: {},
    users: {}
};

// {} |
