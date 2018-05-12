import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IFilterCategoryBiz } from '../bizModel/model/filterCategory.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { EntityTypeEnum } from '../entity/entity.model';
import { IAppState, STORE_KEY } from '../store.model';
import { entityFilterAction, entitySearchAction, entitySelectAction } from '../ui/ui.action';
import { STORE_UI_COMMON_KEY, STORE_UI_KEY } from '../ui/ui.model';
import { FilterCategoryService } from './filterCategory.service';

@Injectable()
export class ViewPointUIService {
    //#region Private members

    private _searchKey: string;
    private _searchKey$: BehaviorSubject<string> = new BehaviorSubject(null);

    private _filters: IFilterCategoryBiz[];
    private _filters$: BehaviorSubject<IFilterCategoryBiz[]> = new BehaviorSubject(null);

    private _searchAction = entitySearchAction(EntityTypeEnum.VIEWPOINT);
    private _selectAction = entitySelectAction(EntityTypeEnum.VIEWPOINT);
    private _filterAction = entityFilterAction(EntityTypeEnum.VIEWPOINT);

    //#region Constructor

    constructor(private _store: NgRedux<IAppState>, private _filterCategoryService: FilterCategoryService) {
        this.getSearchKey(this._store).subscribe(value => {
            this._searchKey = value;
            this._searchKey$.next(value);
        });

        this.getFilters(this._store).subscribe(value => {
            this._filters = value;
            this._filters$.next(value);
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

    public get filters$(): Observable<IFilterCategoryBiz[]> {
        return this._filters$.asObservable();
    }

    public filters(): IFilterCategoryBiz[] {
        return this._filters;
    }

    //#endregion

    //#region Public methods

    public search(searchKey: string) {
        this._store.dispatch(this._searchAction(searchKey));
    }

    public select(viewPoint: IViewPointBiz) {
        this._store.dispatch(this._selectAction(viewPoint.id));
    }

    public filter(selectedCriteriaId: string, unSelectedCriteriaIds: string[] = []) {
        this._store.dispatch(this._filterAction(selectedCriteriaId, unSelectedCriteriaIds));
    }

    //#endregion

    //#region Private methods

    private getSearchKey(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_COMMON_KEY.searchKey]);
    }

    private getFilters(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
        return this._filterCategoryService.getFilters(this.getFilterIds(store));
    }

    private getFilterIds(store: NgRedux<IAppState>): Observable<string[]> {
        return store.select<string[]>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_COMMON_KEY.filterIds]);
    }

    //#endregion
}
