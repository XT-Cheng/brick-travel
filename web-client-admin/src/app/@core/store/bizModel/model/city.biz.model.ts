import { IBiz } from '../biz.model';

export interface ICityBiz extends IBiz {
    id: string;
    name: string;
    thumbnail: string;
    addressCode: string;
}
