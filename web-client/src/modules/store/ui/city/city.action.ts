import { FluxStandardAction } from 'flux-standard-action';
import { IActionMetaInfo, IActionPayload } from '../../store.action';
import { ICityBiz } from '../../../../bizModel/model/city.biz.model';

export interface IUICityActionMetaInfo extends IActionMetaInfo {

}

export interface IUICityActionPayload extends IActionPayload {
    selectedCityId: string
}

let defaultCityActionPayload = {
    selectedCityId: '',
    error: null,
}

export type UICityAction = FluxStandardAction<IUICityActionPayload, IUICityActionMetaInfo>;

export enum UICityActionTypeEnum {
    SELECT_CITY = "UI:VIEWPOINT:SELECT_CITY",
}

export function selectCityAction(city: ICityBiz): UICityAction {
    return {
        type: UICityActionTypeEnum.SELECT_CITY,
        meta: { progressing : false },
        payload: Object.assign({},defaultCityActionPayload,{
            selectedCityId: city?city._id:''
        })
    };
}
