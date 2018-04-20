import { ICity } from '../../entity/city/city.model';
import { IBiz } from '../biz.model';

export interface ICityBiz extends IBiz {
    name: string;
    thumbnail: string;
    adressCode: string;
}

export function translateCityFromBiz(city: ICityBiz): ICity {
    return {
        id: city.id,
        name: city.name,
        thumbnail: city.thumbnail,
        adressCode: city.adressCode
    };
}
