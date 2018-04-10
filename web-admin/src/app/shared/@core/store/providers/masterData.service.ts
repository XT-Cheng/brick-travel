import { dispatch, NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
    EntityAction,
    EntityActionPhaseEnum,
    EntityActionTypeEnum,
    entityLoadAction,
    entityLoadActionFailed,
    entityLoadActionStarted,
    entityLoadActionSucceeded,
    EntityTypeEnum,
} from 'shared/@core/store/entity/entity.action';
import { IEntities } from 'shared/@core/store/entity/entity.model';
import { viewPointCategory } from 'shared/@core/store/entity/entity.schema';
import { IAppState } from 'shared/@core/store/store.model';
import { WEBAPI_HOST } from 'shared/@core/utils/constants';

@Injectable()
export class MasterDataService {
    //#region Constructor
    constructor(private _http: HttpClient,
        private _store: NgRedux<IAppState>) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    //#region load actions
    private loadMasterDataStartedAction = entityLoadActionStarted(EntityTypeEnum.MASTER_DATA);

    @dispatch()
    private loadMasterDataAction = entityLoadAction(EntityTypeEnum.MASTER_DATA);

    private loadMasterDataSucceededAction = entityLoadActionSucceeded(EntityTypeEnum.MASTER_DATA);

    private loadMasterDataFailedAction = entityLoadActionFailed(EntityTypeEnum.MASTER_DATA)
    //#endregion

    //#region update actions

    //#endregion

    //#region insert actions

    //#endregion

    //#region delete actions
    
    //#endregion

    //#endregion
    //#region UI Actions
   
    //#region Dirty Actions
    
    //#endregion

    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createEpicInternal(EntityTypeEnum.CITY)];
    }

    private createEpicInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType == entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => this.getMasterDatas()
                .map(data => this.loadMasterDataSucceededAction(data))
                .catch(response =>
                    of(this.loadMasterDataFailedAction(response))
                )
                .startWith(this.loadMasterDataStartedAction()));
    }
    //#endregion

    //#region Private methods
    private getMasterDatas(): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}/masterData`)
            .map(records => {
                const schema = { viewPointCategories: [ viewPointCategory ] }
                return normalize(records, schema).entities;
            })
    }
    //#endregion

    //#region Public methods
    public load() {
        this.loadMasterDataAction();
    }

    //#endregion

    //#region CRUD methods
    
    //#endregion
}