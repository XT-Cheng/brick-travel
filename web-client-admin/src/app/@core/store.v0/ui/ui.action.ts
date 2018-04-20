import { FluxStandardAction } from 'flux-standard-action';

import { EntityTypeEnum } from '../entity/entity.action';
import { IActionMetaInfo, IActionPayload } from '../store.action';

export enum UIActionTypeEnum {
    SELECT = 'UI:SELECT',
    SEARCH = 'UI:SEARCH',
}

export interface IUIActionPayload extends IActionPayload {
    entityType: EntityTypeEnum;
    searchKey?: string;
    selectedId?: string;
}

// Flux-standard-action gives us stronger typing of our actions.
export type UIAction = FluxStandardAction<IUIActionPayload, IActionMetaInfo>;

const defaultUIActionPayload = {
    entityType: null,
    searchKey: '',
    selectedId: ''
};

//#region Search Actions
export function entitySearchAction(entityType: EntityTypeEnum) {
    return (searchKey: string) => ({
        type: UIActionTypeEnum.SEARCH,
        meta: { progressing: false },
        payload: Object.assign({}, defaultUIActionPayload, {
            searchKey: searchKey
        })
    });
}

export function entitySelectAction(entityType: EntityTypeEnum) {
    return (selectedId: string) => ({
        type: UIActionTypeEnum.SELECT,
        meta: { progressing: false },
        payload: Object.assign({}, defaultUIActionPayload, {
            selectedId: selectedId
        })
    });
}
