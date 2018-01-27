import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';

import { Injectable } from '@angular/core';
import { Epic } from 'redux-observable';
import { of } from 'rxjs/observable/of';

import { IAppState } from '../../store.model';
import { EntityAction, EntityActionTypeEnum, EntityTypeEnum, EntityActionPhaseEnum } from '../entity.action';
import { FilterCategoryActionGenerator } from './filterCategory.action';
import { FilterCategoryService } from './filterCategory.service';

@Injectable()
export class FilterCategoryEpic {
  constructor(
    private _service: FilterCategoryService,
    private _action: FilterCategoryActionGenerator,
  ) {}

  public createEpic() {
    return this.createEpicInternal(EntityTypeEnum.FILTERCATEGORY);
  }

  private createEpicInternal(entityType : EntityTypeEnum ): Epic<EntityAction, IAppState> {
    return (action$, store) => action$
      .ofType(EntityActionTypeEnum.LOAD)
      .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
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
