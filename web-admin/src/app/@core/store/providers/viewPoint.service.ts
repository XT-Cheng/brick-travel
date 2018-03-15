import { dispatch } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Immutable from 'seamless-immutable';

import { IViewPointBiz } from '../bizModel/viewPoint.biz.model';
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
} from '../entity/entity.action';
import { IEntities } from '../entity/entity.model';
import { viewPoint } from '../entity/entity.schema';
import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IAppState } from '../store.model';
import { INIT_UI_VIEWPOINT_STATE, STORE_UI_VIEWPOINT_KEY,IViewPointUI } from '../ui/viewPoint/viewPoint.model';
import { WEBAPI_HOST } from '../../utils/constants';

interface IUIViewPointActionMetaInfo extends IActionMetaInfo {

}

 interface IUIViewPointActionPayload extends IActionPayload {
    searchKey?: string,
    viewMode? : boolean,
    selectedViewPointId?: string,
    selectCriteria?: {
        selectedCriteriaId: string,
        unSelectedCriteriaIds: string[]
    }
}

const defaultViewPointActionPayload = {
    searchKey: '',
    viewMode: true,
    selectedViewPointId: '',
    selectCriteria: null,
    error: null,
}

 type UIViewPointAction = FluxStandardAction<IUIViewPointActionPayload, IUIViewPointActionMetaInfo>;

 enum UIViewPointActionTypeEnum {
    SEARCH_VIEWPOINT = "UI:VIEWPOINT:SEARCH_VIEWPOINT",
    SELECT_VIEWPOINT = "UI:VIEWPOINT:SELECT_VIEWPOINT",
    SELECT_CRITERIA = "UI:VIEWPOINT:SELECT_CRITERIA",
    SET_VIEWMODE = "SET_VIEWMODE"
}

export function viewPointReducer(state = INIT_UI_VIEWPOINT_STATE, action: UIViewPointAction): IViewPointUI {
    switch (action.type) {
      case UIViewPointActionTypeEnum.SEARCH_VIEWPOINT: {
        return <any>Immutable(state).set(STORE_UI_VIEWPOINT_KEY.searchKey, action.payload.searchKey);
      }
      case UIViewPointActionTypeEnum.SELECT_VIEWPOINT: {
        return <any>Immutable(state).set(STORE_UI_VIEWPOINT_KEY.selectedViewPointId, action.payload.selectedViewPointId);
      }
      case UIViewPointActionTypeEnum.SET_VIEWMODE: {
        return <any>Immutable(state).set(STORE_UI_VIEWPOINT_KEY.viewMode, action.payload.viewMode);
      }
      case UIViewPointActionTypeEnum.SELECT_CRITERIA: {
  
        state = <any>Immutable(state).set(STORE_UI_VIEWPOINT_KEY.selectedViewPointId, action.payload.selectedViewPointId);
  
        let select = action.payload.selectCriteria;

        if (select) {
          let filterCriteriaIds = (<any[]>state[STORE_UI_VIEWPOINT_KEY.filterCriteriaIds])
            .filter(id => !select.unSelectedCriteriaIds.find(removed => removed === id));
  
          if (action.payload.selectCriteria.selectedCriteriaId)
            filterCriteriaIds = filterCriteriaIds.concat(action.payload.selectCriteria.selectedCriteriaId);
  
          return <any>Immutable(state).set(STORE_UI_VIEWPOINT_KEY.filterCriteriaIds, filterCriteriaIds);
        }
      }
    }
    return <any>state;
  };

@Injectable()
export class ViewPointService {
    //#region Constructor
    constructor(private _http: HttpClient) {
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    private loadViewPointStartedAction = entityLoadActionStarted(EntityTypeEnum.VIEWPOINT);

    @dispatch()
    private  loadViewPointsAction = entityLoadAction(EntityTypeEnum.VIEWPOINT);

    private loadViewPointSucceededAction = entityLoadActionSucceeded(EntityTypeEnum.VIEWPOINT);
    
    private loadViewPointFailedAction  = entityLoadActionFailed(EntityTypeEnum.VIEWPOINT);

    @dispatch()
    private loadViewPointCommentsAction = entityLoadAction(EntityTypeEnum.VIEWPOINTCOMMENT);

    private loadViewPointCommentsSucceededAction = entityLoadActionSucceeded(
        EntityTypeEnum.VIEWPOINTCOMMENT,EntityActionTypeEnum.APPEND_COMMENTS);
    
    private loadViewPointCommentsFailedAction  = entityLoadActionFailed(EntityTypeEnum.VIEWPOINTCOMMENT);
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
    private setViewModeAction(viewMode: boolean): UIViewPointAction {
        return {
            type: UIViewPointActionTypeEnum.SET_VIEWMODE,
            meta: { progressing : false },
            payload: Object.assign({},defaultViewPointActionPayload,{
                viewMode: viewMode
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
            .map(data => this.loadViewPointSucceededAction(data))
            .catch(response => 
              of(this.loadViewPointFailedAction(response))
            )
            .startWith(this.loadViewPointStartedAction())
          });
      }
    
      private createEpicLoadViewPointCommentInternal(entityType : EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
          .ofType(EntityActionTypeEnum.LOAD)
          .filter(action => action.meta.entityType === entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
          .switchMap(action => {
            return this.getViewPointComments(action.meta.pagination,action.payload.queryCondition)
            .map(data => this.loadViewPointCommentsSucceededAction(data))
            .catch(response => 
              of(this.loadViewPointCommentsFailedAction(response))
            )
          });
      }
    //#endregion

    //#region Private methods
    private getViewPoints(pagination : IPagination, queryCondition : IQueryCondition): Observable<IEntities> {
        let url = `${WEBAPI_HOST}/`;
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
        let url = `${WEBAPI_HOST}/viewPoints/${queryCondition['viewPointId']}/comments?skip=${pagination.page}&&limit=${pagination.limit}`;
        
        return this._http.get(url)
        .map(records => {
          return normalize(records, viewPoint).entities;
        })
      }
    //#endregion

    //#region Public methods
    public load(queryCondition? : IQueryCondition) {
        this.loadViewPointsAction(queryCondition);
    }

    public loadComments(queryCondition? : IQueryCondition,page? : number, limit? : number) {
        this.loadViewPointCommentsAction(queryCondition,page,limit);
    }

    public selectViewPoint(viewPoint: IViewPointBiz) {
        this.selectViewPointAction(viewPoint?viewPoint.id:'');
    }

    public search(searchKey : string) {
        this.searchViewPointAction(searchKey);
    }

    public selectCriteria(selectedCriteriaId: string, unSelectedCriteriaIds: string[]) {
        this.selectCriteriaAction(selectedCriteriaId,unSelectedCriteriaIds);
    }

    public setViewMode(viewMode : boolean) {
        this.setViewModeAction(viewMode);
    }
    //#endregion
}