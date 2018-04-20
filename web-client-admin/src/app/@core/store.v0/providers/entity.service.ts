import { dispatch, NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';

import { FileUploader } from '../../fileUpload/providers/file-uploader';
import {
    entityDeleteAction,
    entityInsertAction,
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
    entityUpdateAction,
} from '../entity/entity.action';
import { IEntity } from '../entity/entity.model';
import { IAppState } from '../store.model';

export abstract class EntityService<T extends IEntity> {
    //#region Constructor
    constructor(protected _http: HttpClient,
        protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>,
        protected _entityType: EntityTypeEnum) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions

    //#region load actions
    protected loadStartedAction = entityLoadActionStarted(this._entityType);

    @dispatch()
    protected loadAction = entityLoadAction(this._entityType);

    protected loadSucceededAction = entityLoadActionSucceeded(this._entityType);

    protected loadFailedAction = entityLoadActionFailed(this._entityType);
    //#endregion

    //#region update actions

    @dispatch()
    private updateCityAction = entityUpdateAction<T>(this._entityType);

    //#endregion

    //#region insert actions

    @dispatch()
    private insertCityAction = entityInsertAction<T>(this._entityType);

    //#endregion

    //#region delete actions
    @dispatch()
    private deleteCityAction = entityDeleteAction<T>(this._entityType);

    //#endregion

    //#endregion

    //#region UI Actions
    @dispatch()
    private searchCityAction(searchKey: string): UIAction {
        return {
            type: UICityActionTypeEnum.SEARCH_CITY,
            meta: { progressing: false },
            payload: Object.assign({}, defaultUICityActionPayload, {
                searchKey: searchKey
            })
        };
    }
    @dispatch()
    private selectCityAction(c: ICityBiz): UICityAction {
        return {
            type: UICityActionTypeEnum.SELECT_CITY,
            meta: { progressing: false },
            payload: <any>Object.assign({}, defaultUICityActionPayload, {
                [STORE_UI_CITY_KEY.selectedCityId]: c ? c.id : ''
            })
        };
    }
    //#endregion
}
