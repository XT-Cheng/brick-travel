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
} from '../modules/store/entity/entity.action';
import { IEntities } from '../modules/store/entity/entity.model';
import { filterCategory } from '../modules/store/entity/entity.schema';
import { IAppState } from '../modules/store/store.model';

@Injectable()
export class FilterCategoryService {
    //#region Constructor
    constructor(private _http: HttpClient) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    private loadFilterCategoryStarted = entityLoadActionStarted(EntityTypeEnum.FILTERCATEGORY);

    @dispatch()
    private loadFilterCategories = entityLoadAction(EntityTypeEnum.FILTERCATEGORY);

    private loadFilterCategorySucceeded = entityLoadActionSucceeded(EntityTypeEnum.FILTERCATEGORY);

    private loadFilterCategoryFailed = entityLoadActionFailed(EntityTypeEnum.FILTERCATEGORY);
    //#endregion

    //#region UI Actions
    
    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return this.createEpicInternal(EntityTypeEnum.FILTERCATEGORY);
    }

    private createEpicInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => {
                return this.getFilterCategory(action.meta.pagination)
                    .map(data => this.loadFilterCategorySucceeded(data))
                    .catch(response =>
                        of(this.loadFilterCategoryFailed(response))
                    )
                    .startWith(this.loadFilterCategoryStarted())
            });
    }
    //#endregion

    //#region Private methods
    private getFilterCategory(pagination: IPagination): Observable<IEntities> {
        return this._http.get('http://localhost:3000/filterCategories')
            .map(records => {
                return normalize(records, [filterCategory]).entities;
            })
    }
    //#endregion

    //#region Public methods
    public load() {
        this.loadFilterCategories();
    }
    //#endregion
}