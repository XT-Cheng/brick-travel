import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { IAppState, STORE_KEY } from '../store.model';
import { entitySearchAction, entitySelectAction } from '../ui/ui.action';
import { STORE_UI_COMMON_KEY, STORE_UI_KEY } from '../ui/ui.model';

@Injectable()
export class ViewPointUIService {
    //#region Private members

    private _searchKey: string;
    private _searchKey$: BehaviorSubject<string> = new BehaviorSubject(null);

    private _searchAction = entitySearchAction(EntityTypeEnum.VIEWPOINT);
    private _selectAction = entitySelectAction(EntityTypeEnum.VIEWPOINT);

    //#region Constructor

    constructor(private _store: NgRedux<IAppState>) {
        this.getSearchKey(this._store).subscribe(value => {
            this._searchKey = value;
            this._searchKey$.next(value);
        });
    }
    //#endregion

    //#region Public property

    public get searchKey(): string {
        return this._searchKey;
    }

    public get searchKey$(): Observable<string> {
        return this._searchKey$.asObservable();
    }
    //#endregion

    //#region Public methods

    public search(searchKey: string) {
        this._store.dispatch(this._searchAction(searchKey));
    }

    public select(c: IViewPointBiz) {
        this._store.dispatch(this._selectAction(c.id));
    }

    //#endregion

    //#region Private methods

    private getSearchKey(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_COMMON_KEY.searchKey]);
    }

    //#endregion
}
