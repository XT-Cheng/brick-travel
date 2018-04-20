import { IEntity } from '../entity.model';

export interface ICity extends IEntity {
    id: string;
    name: string;
    thumbnail: string;
    adressCode: string;
}
