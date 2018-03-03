import { dispatch } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { normalize } from 'normalizr';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import * as Immutable from 'seamless-immutable';

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
import { user } from '../entity/entity.schema';
import { IActionMetaInfo, IActionPayload } from '../store.action';
import { IAppState } from '../store.model';
import { INIT_UI_USER_STATE, IUserUI, STORE_UI_USER_KEY } from '../ui/user/user.model';
import { WEBAPI_HOST } from '../utils/constants';
import { NbAuthService, NbAuthToken, NbAuthJWTToken } from '@nebular/auth';
import { IUserBiz } from '../bizModel/user.biz.model';

interface IUIUserActionMetaInfo extends IActionMetaInfo {
}

interface IUIUserActionPayload extends IActionPayload {
    userLoggedIn: string
}

const defaultUIUserActionPayload = {
    [STORE_UI_USER_KEY.userLoggedIn]: '',
    error: null,
}

type UIUserAction = FluxStandardAction<IUIUserActionPayload, IUIUserActionMetaInfo>;

enum UIUserActionTypeEnum {
    USER_LOGGED_IN = "UI:USER:USER_LOGGED_IN",
}

export function userReducer(state = INIT_UI_USER_STATE, action: UIUserAction): IUserUI {
    switch (action.type) {
        case UIUserActionTypeEnum.USER_LOGGED_IN: {
            return <any>Immutable(state).set(STORE_UI_USER_KEY.userLoggedIn, action.payload[STORE_UI_USER_KEY.userLoggedIn]);
        }
    }
    return <any>state;
};


@Injectable()
export class UserService {
    //#region Constructor
    constructor(private _http: HttpClient,private _auth : NbAuthService) {
        this._auth.onTokenChange().delay(0).subscribe((token: NbAuthJWTToken) => {
            if (token.isValid()) {
                let {id,name,nick,picture} = token.getPayload();
                let userBiz = {
                    id,name,nick,picture
                };
                this.addLoggedInUserAction({
                    users: { [userBiz.id] : userBiz }
                });
                this.userLoggedInAction(userBiz);
              }
        });
    }
    //#endregion

    //#region Actions

    //#region Entity Actions
    private loadUserStartedAction = entityLoadActionStarted(EntityTypeEnum.USER);

    @dispatch()
    private loadUsersAction = entityLoadAction(EntityTypeEnum.USER);

    private loadUserSucceededAction = entityLoadActionSucceeded(EntityTypeEnum.USER);

    private loadUserFailedAction = entityLoadActionFailed(EntityTypeEnum.USER)

    @dispatch()
    private addLoggedInUserAction = entityLoadActionSucceeded(EntityTypeEnum.USER);
    //#endregion

    //#region UI Actions
    @dispatch()
    private userLoggedInAction(user: IUserBiz): UIUserAction {
        return {
            type: UIUserActionTypeEnum.USER_LOGGED_IN,
            meta: { progressing: false },
            payload: <any>Object.assign({}, defaultUIUserActionPayload, {
                [STORE_UI_USER_KEY.userLoggedIn]: user ? user.id : ''
            })
        };
    }
    //#endregion

    //#endregion

    //#region Epic
    public createEpic() {
        return [this.createEpicInternal(EntityTypeEnum.USER)];
    }

    private createEpicInternal(entityType: EntityTypeEnum): Epic<EntityAction, IAppState> {
        return (action$, store) => action$
            .ofType(EntityActionTypeEnum.LOAD)
            .filter(action => action.meta.entityType == entityType && action.meta.phaseType == EntityActionPhaseEnum.TRIGGER)
            .switchMap(action => this.getUsers(action.meta.pagination)
                .map(data => this.loadUserSucceededAction(data))
                .catch(response =>
                    of(this.loadUserFailedAction(response))
                )
                .startWith(this.loadUserStartedAction()));
    }
    //#endregion

    //#region Private methods
    private getUsers(pagination: IPagination): Observable<IEntities> {
        return this._http.get(`${WEBAPI_HOST}/users`)
            .map(records => {
                return normalize(records, [user]).entities;
            })
    }
    //#endregion

    //#region Public methods
    public load() {
        this.loadUsersAction();
    }
}