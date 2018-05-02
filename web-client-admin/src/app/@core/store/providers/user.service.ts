import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { AuthService } from '../../auth/providers/authService';
import { AuthToken } from '../../auth/providers/authToken';
import { TokenService } from '../../auth/providers/tokenService';
import { TokenStorage } from '../../auth/providers/tokenStorage';
import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { IUserBiz } from '../bizModel/model/user.biz.model';
import { EntityActionTypeEnum } from '../entity/entity.action';
import { EntityTypeEnum, INIT_ENTITY_STATE, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { user } from '../entity/entity.schema';
import { IUser } from '../entity/model/user.model';
import { IAppState, STORE_KEY } from '../store.model';
import { userLoggedInAction } from '../ui/reducer/user.reducer';
import { STORE_UI_KEY } from '../ui/ui.model';
import { EntityService } from './entity.service';

@Injectable()
export class UserService extends EntityService<IUser, IUserBiz> {
    //#region private member

    private _all$: BehaviorSubject<IUserBiz[]> = new BehaviorSubject([]);
    private _loggedIn$: BehaviorSubject<IUserBiz> = new BehaviorSubject(null);
    private _loggedIn: IUserBiz;

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        private _auth: AuthService, private _tokenService: TokenService, private _storage: Storage,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.USER, [user], `users`);

        this._storage.get(TokenStorage.TOKEN_KEY).then((value) =>
            this._tokenService.setRaw(value)
        );

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

        this.getAll(this._store).subscribe((value) => {
            this._all$.next(value);
        });

        this.getLoggedIn(this._store).subscribe((value) => {
            this._loggedIn = value;
            this._loggedIn$.next(value);
        });
    }
    //#endregion

    //#region implemented methods
    protected toTransfer(bizModel: IUserBiz) {
        throw new Error('Method not implemented.');
    }
    //#endregion

    //#region public methods
    public get all$(): Observable<IUserBiz[]> {
        return this._all$.asObservable();
    }

    public get loggedIn$(): Observable<IUserBiz> {
        return this._loggedIn$;
    }

    public get loggedIn(): IUserBiz {
        return this._loggedIn;
    }

    public byId(id: string): IUserBiz {
        return denormalize(id, user, Immutable(this._store.getState().entities).asMutable({ deep: true }));
    }
    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: IUserBiz) {
        this.insertEntity(c);
    }

    public change(c: IUserBiz) {
        this.updateEntity(c);
    }

    public remove(c: IUserBiz) {
        this.deleteEntity(c);
    }

    //#endregion

    //#endregion

    //#region Entities Selector
    private setCurrentUser(u: IUserBiz) {
        this._store.dispatch(this.succeededAction(EntityActionTypeEnum.LOAD, Object.assign({}, INIT_ENTITY_STATE,
            { users: { [u.id]: u } })));

        this._store.dispatch(userLoggedInAction(u));
    }

    private getAll(store: NgRedux<IAppState>): Observable<IUserBiz[]> {
        return store.select<{ [id: string]: IUser }>([STORE_KEY.entities, STORE_ENTITIES_KEY.users]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [user], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    private getLoggedIn(store: NgRedux<IAppState>): Observable<IUserBiz> {
        return this.getLoggedInId(store).pipe(
            switchMap(id => {
                return store.select<IUser>([STORE_KEY.entities, STORE_ENTITIES_KEY.users, id]);
            }),
            map(ct => {
                return ct ? denormalize(ct.id, user, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
        );
    }

    private getLoggedInId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.user, 'userLoggedIn']);
    }

    //#endregion
}
