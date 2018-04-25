import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as Immutable from 'seamless-immutable';

import { FILE_UPLOADER } from '../../fileUpload/fileUpload.module';
import { FileUploader } from '../../fileUpload/providers/file-uploader';
import { IUserBiz, translateUserFromBiz } from '../bizModel/model/user.biz.model';
import { EntityTypeEnum, STORE_ENTITIES_KEY } from '../entity/entity.model';
import { user } from '../entity/entity.schema';
import { IUser } from '../entity/model/user.model';
import { IAppState, STORE_KEY } from '../store.model';
import { EntityService } from './entity.service';

@Injectable()
export class UserService extends EntityService<IUser, IUserBiz> {
    //#region private member

    private _usersSelector$: BehaviorSubject<IUserBiz[]> = new BehaviorSubject([]);

    //#endregion

    //#region Constructor
    constructor(protected _http: HttpClient,
        @Inject(FILE_UPLOADER) protected _uploader: FileUploader,
        protected _store: NgRedux<IAppState>) {
        super(_http, _uploader, _store, EntityTypeEnum.USER, [user], `users`);

        this.getUsers(this._store).subscribe((value) => {
            this._usersSelector$.next(value);
        });
    }
    //#endregion

    //#region public methods
    public get users$(): Observable<IUserBiz[]> {
        return this._usersSelector$.asObservable();
    }

    //#region CRUD methods

    public fetch() {
        this.loadEntities();
    }

    public add(c: IUserBiz) {
        this.insertEntity(translateUserFromBiz(c));
    }

    public change(c: IUserBiz) {
        this.updateEntity(translateUserFromBiz(c));
    }

    public remove(c: IUserBiz) {
        this.deleteEntity(translateUserFromBiz(c));
    }

    //#endregion

    //#endregion

    //#region Entities Selector

    private getUsers(store: NgRedux<IAppState>): Observable<IUserBiz[]> {
        return store.select<{ [id: string]: IUser }>([STORE_KEY.entities, STORE_ENTITIES_KEY.users]).pipe(
            map((data) => {
                return denormalize(Object.keys(data), [user], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
        );
    }

    //#endregion
}
