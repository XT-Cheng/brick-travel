import { dispatch } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Immutable from 'seamless-immutable';

import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
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
    IQueryCondition,
} from '../modules/store/entity/entity.action';
import { IEntities } from '../modules/store/entity/entity.model';
import { viewPoint } from '../modules/store/entity/entity.schema';
import { IActionMetaInfo, IActionPayload } from '../modules/store/store.action';
import { IAppState } from '../modules/store/store.model';
import { INIT_UI_VIEWPOINT_STATE, IViewPointUI } from '../modules/store/ui/viewPoint/viewPoint.model';

interface IUIViewPointActionMetaInfo extends IActionMetaInfo {

}

 interface IUIViewPointActionPayload extends IActionPayload {
    searchKey?: string,
    selectedViewPointId?: string,
    selectCriteria?: {
        selectedCriteriaId: string,
        unSelectedCriteriaIds: string[]
    }
}

const defaultViewPointActionPayload = {
    searchKey: '',
    selectedViewPointId: '',
    selectCriteria: null,
    error: null,
}

 type UIViewPointAction = FluxStandardAction<IUIViewPointActionPayload, IUIViewPointActionMetaInfo>;

 enum UIViewPointActionTypeEnum {
    SEARCH_VIEWPOINT = "UI:VIEWPOINT:SEARCH_VIEWPOINT",
    SELECT_VIEWPOINT = "UI:VIEWPOINT:SELECT_VIEWPOINT",
    SELECT_CRITERIA = "UI:VIEWPOINT:SELECT_CRITERIA"
}

export function viewPointReducer(state = INIT_UI_VIEWPOINT_STATE, action: UIViewPointAction): IViewPointUI {
    switch (action.type) {
      case UIViewPointActionTypeEnum.SEARCH_VIEWPOINT: {
        return Immutable(state).set('searchKey', action.payload.searchKey);
      }
      case UIViewPointActionTypeEnum.SELECT_VIEWPOINT: {
        return Immutable(state).set('selectedViewPointId', action.payload.selectedViewPointId);
      }
      case UIViewPointActionTypeEnum.SELECT_CRITERIA: {
  
        state = Immutable(state).set('selectedViewPointId', action.payload.selectedViewPointId);
  
        let select = action.payload.selectCriteria;
  
        if (select) {
          let filterCriteriaIds = state.filterCriteriaIds
            .filter(id => !select.unSelectedCriteriaIds.find(removed => removed === id));
  
          if (action.payload.selectCriteria.selectedCriteriaId)
            filterCriteriaIds = filterCriteriaIds.concat(action.payload.selectCriteria.selectedCriteriaId);
  
          return Immutable(state).set('filterCriteriaIds', filterCriteriaIds);
        }
      }
    }
    return state;
  };

@Injectable()
export class ViewPointService {
    //#region Constructor
    constructor(private _http: HttpClient) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    private loadViewPointStarted = entityLoadActionStarted(EntityTypeEnum.VIEWPOINT);

    @dispatch()
    private  loadViewPoints = entityLoadAction(EntityTypeEnum.VIEWPOINT);

    private loadViewPointSucceeded = entityLoadActionSucceeded(EntityTypeEnum.VIEWPOINT);
    
    private loadViewPointFailed  = entityLoadActionFailed(EntityTypeEnum.VIEWPOINT);

    @dispatch()
    private loadViewPointComments = entityLoadAction(EntityTypeEnum.VIEWPOINTCOMMENT);

    private loadViewPointCommentsSucceeded = entityLoadActionSucceeded(
        EntityTypeEnum.VIEWPOINTCOMMENT,EntityActionTypeEnum.APPEND_COMMENTS);
    
    private loadViewPointCommentsFailed  = entityLoadActionFailed(EntityTypeEnum.VIEWPOINTCOMMENT);
    //#endregion

    //#region UI Actions
    @dispatch()
    private searchViewPointAction(searchKey: string): UIViewPointAction {
        return {
            type: UIViewPointActionTypeEnum.SEARCH_VIEWPOINT,
            meta: { progressing : false },
            payload: Object.assign({},defaultViewPointActionPayload,{
                searchKey: searchKey
            })
        };
    }
    
    @dispatch()
    private selectViewPointAction(viewPoint: IViewPointBiz | string): UIViewPointAction {
        return {
            type: UIViewPointActionTypeEnum.SELECT_VIEWPOINT,
            meta: { progressing : false },
            payload: Object.assign({},defaultViewPointActionPayload,{
                selectedViewPointId: viewPoint? (typeof viewPoint === 'string' ? viewPoint : viewPoint.id) : ''
            })
        };
    }
    
    @dispatch()
    private selectCriteriaAction(selectedCriteriaId: string, unSelectedCriteriaIds: string[]): UIViewPointAction {
        return {
            type: UIViewPointActionTypeEnum.SELECT_CRITERIA,
            meta: { progressing : false },
            payload: Object.assign({},defaultViewPointActionPayload,{
                selectCriteria: {
                    selectedCriteriaId: selectedCriteriaId,
                    unSelectedCriteriaIds: unSelectedCriteriaIds
                }
            })
        };
    }
    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createEpicLoadViewPointInternal(EntityTypeEnum.VIEWPOINT),
          this.createEpicLoadViewPointCommentInternal(EntityTypeEnum.VIEWPOINTCOMMENT)];
      }
    
      private createEpicLoadViewPointInternal(entityType : EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
          .ofType(EntityActionTypeEnum.LOAD)
          .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
          .switchMap(action => {
            return this.getViewPoints(action.meta.pagination,action.payload.queryCondition)
            .map(data => this.loadViewPointSucceeded(data))
            .catch(response => 
              of(this.loadViewPointFailed(response))
            )
            .startWith(this.loadViewPointStarted())
          });
      }
    
      private createEpicLoadViewPointCommentInternal(entityType : EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
          .ofType(EntityActionTypeEnum.LOAD)
          .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
          .switchMap(action => {
            return this.getViewPointComments(action.meta.pagination,action.payload.queryCondition)
            .map(data => this.loadViewPointCommentsSucceeded(data))
            .catch(response => 
              of(this.loadViewPointCommentsFailed(response))
            )
          });
      }
    //#endregion

    //#region Private methods
    private getViewPoints(pagination : IPagination, queryCondition : IQueryCondition): Observable<IEntities> {
        let url = 'http://localhost:3000/';
        if (queryCondition) {
          url += queryCondition['cityId'];
          url += '/viewPoints';;
        }
        else {
          url += 'viewPoints';
        }
        
        return this._http.get(url)
        .map(records => {
          return normalize(records, [ viewPoint ]).entities;
        })
      }
    
      private getViewPointComments(pagination : IPagination, queryCondition : IQueryCondition): Observable<IEntities> {
        let url = `http://localhost:3000/viewPoints/${queryCondition['viewPointId']}/comments?skip=${pagination.page}&&limit=${pagination.limit}`;
        
        return this._http.get(url)
        .map(records => {
          return normalize(records, viewPoint).entities;
        })
      }
    //#endregion

    //#region Public methods
    public load(queryCondition? : IQueryCondition) {
        this.loadViewPoints(queryCondition);
    }

    public loadComments(queryCondition? : IQueryCondition,page? : number, limit? : number) {
        this.loadViewPointComments(queryCondition,page,limit);
    }

    public select(viewPoint: IViewPointBiz) {
        this.selectViewPointAction(viewPoint?viewPoint.id:'');
    }

    public search(searchKey : string) {
        this.searchViewPointAction(searchKey);
    }

    public selectCriteria(selectedCriteriaId: string, unSelectedCriteriaIds: string[]) {
        this.selectCriteriaAction(selectedCriteriaId,unSelectedCriteriaIds);
    }
    //#endregion
}