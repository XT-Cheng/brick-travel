import { ICity } from '../../entity/model/city.model';
import { IBiz } from '../biz.model';

export interface ICityBiz extends IBiz {
    name: string;
    thumbnail: string;
    addressCode: string;
}

export function translateCityFromBiz(city: ICityBiz): ICity {
    return {
        id: city.id,
        name: city.name,
        thumbnail: city.thumbnail,
        addressCode: city.addressCode
    };
}
