import { ICity } from "../entity/city/city.model";

export interface ICityBiz {
    id: string
    name: string
    thumbnail: string
    adressCode: string
}

export function translateCityFromBiz(city: ICityBiz): ICity {
    return {
        id: city.id,
        name: city.name,
        thumbnail: city.thumbnail,
        adressCode: city.adressCode
    };
}