import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../../store.model';
import { FilterCategoryService } from './filterCategory.service';
import { FilterCategoryAction } from './filterCategory.action';
import { EntityAction, EntityActionTypeEnum, EntityTypeEnum } from '../entity.action';

@Injectable()
export class FilterCategoryEpic {
  constructor(
    private _service: FilterCategoryService,
    private _action: FilterCategoryAction,
  ) {}

  public createEpic() {
    return createEpicMiddleware(this.createEpicInternal(EntityTypeEnum.FILTERCATEGORY));
  }

  private createEpicInternal(entityType : EntityTypeEnum ): Epic<EntityAction, IAppState> {
    return (action$, store) => action$
      .ofType(EntityActionTypeEnum.LOAD)
      .filter(action => action.meta.entityType === entityType && !!action.meta.pagination)
      .switchMap(action => {
        return this._service.getFilterCategory(action.meta.pagination)
        .map(data => this._action.loadFilterCategorySucceeded(data))
        .catch(response => 
          of(this._action.loadFilterCategoryFailed(response))
        )
        .startWith(this._action.loadFilterCategoryStarted())
      });
  }
}
