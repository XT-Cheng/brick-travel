import { dispatch } from '@angular-redux/store';
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
    IPagination,
} from '../entity/entity.action';
import { IEntities } from '../entity/entity.model';
import { filterCategory } from '../entity/entity.schema';
import { IAppState } from '../store.model';
import { WEBAPI_HOST } from '../../utils/constants';

@Injectable()
export class FilterCategoryService {
    //#region Constructor
    constructor(private _http: HttpClient) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    private loadFilterCategoryStartedAction = entityLoadActionStarted(EntityTypeEnum.FILTERCATEGORY);

    @dispatch()
    private loadFilterCategoriesAction = entityLoadAction(EntityTypeEnum.FILTERCATEGORY);

    private loadFilterCategorySucceededAction = entityLoadActionSucceeded(EntityTypeEnum.FILTERCATEGORY);

    private loadFilterCategoryFailedAction = entityLoadActionFailed(EntityTypeEnum.FILTERCATEGORY);
    //#endregion

    //#region UI Actions
    
    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createEpicInternal(EntityTypeEnum.FILTERCATEGORY)];
    }

    private createEpicInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => {
                return this.getFilterCategory(action.meta.pagination)
                    .map(data => this.loadFilterCategorySucceededAction(data))
                    .catch(response =>
                        of(this.loadFilterCategoryFailedAction(response))
                    )
                    .startWith(this.loadFilterCategoryStartedAction())
            });
    }
    //#endregion

    //#region Private methods
    private getFilterCategory(pagination: IPagination): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}/filterCategories`)
            .map(records => {
                return normalize(records, [filterCategory]).entities;
            })
    }
    //#endregion

    //#region Public methods
    public load() {
        this.loadFilterCategoriesAction();
    }
    //#endregion
}