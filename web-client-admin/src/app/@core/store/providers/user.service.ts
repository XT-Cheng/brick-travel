import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { AuthService } from '../../auth/providers/authService';
import { AuthToken } from '../../auth/providers/authToken';
import { TokenService } from '../../auth/providers/tokenService';
import { IUserBiz } from '../bizModel/model/user.biz.model';
import { EntityActionTypeEnum } from '../entity/entity.action';
import { EntityTypeEnum, INIT_ENTITY_STATE, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { userSchema } from '../entity/entity.schema';
import { IUser } from '../entity/model/user.model';
import { IAppState, STORE_KEY } from '../store.model';
import { userLoggedInAction } from '../ui/reducer/user.reducer';
import { STORE_UI_KEY } from '../ui/ui.model';
import { EntityService } from './entity.service';
import { ErrorService } from './error.service';

@Injectable()
export class UserService extends EntityService<IUser, IUserBiz> {
    //#region Private member

    private _loggedIn$: BehaviorSubject<IUserBiz> = new BehaviorSubject(null);
    private _loggedIn: IUserBiz;

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient, protected _errorService: ErrorService,
        private _auth: AuthService, private _tokenService: TokenService, private _storage: Storage,
        protected _store: NgRedux<IAppState>) {
        super(_http, _store, EntityTypeEnum.USER, userSchema, `users`, _errorService);

        this._auth.onTokenChange()
            .subscribe((token: AuthToken) => {
                if (token.isValid()) {
                    const { id, name, nick, picture } = token.getPayload();
                    const userBiz = {
                        id, name, nick, picture
                    };
                    this.setCurrentUser(userBiz);
                }
            });

        this.getLoggedIn(this._store).subscribe((value) => {
            this._loggedIn = value;
            this._loggedIn$.next(value);
        });
    }
    //#endregion

    //#region Public methods

    public get loggedIn$(): Observable<IUserBiz> {
        return this._loggedIn$;
    }

    public get loggedIn(): IUserBiz {
        return this._loggedIn;
    }

    public byId(id: string): IUserBiz {
        return denormalize(id, userSchema, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }

    //#endregion

    //#region Private methods

    private setCurrentUser(u: IUserBiz) {
        this._store.dispatch(this.succeededAction(EntityActionTypeEnum.LOAD, Object.assign({}, INIT_ENTITY_STATE,
            { users: { [u.id]: u } })));

        this._store.dispatch(userLoggedInAction(u));
    }

    private getLoggedIn(store: NgRedux<IAppState>): Observable<IUserBiz> {
        return this.getLoggedInId(store).pipe(
            switchMap(id => {
                return store.select<IUser>([STORE_KEY.entities, STORE_ENTITIES_KEY.users, id]);
            }),
            map(ct => {
                return ct ? denormalize(ct.id, userSchema, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getLoggedInId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.user, 'userLoggedIn']);
    }

    //#endregion
}
