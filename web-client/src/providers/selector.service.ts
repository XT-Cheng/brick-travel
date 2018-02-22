import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as Immutable from 'seamless-immutable';

import { ICityBiz } from '../bizModel/model/city.biz.model';
import { IFilterCategoryBiz } from '../bizModel/model/filterCategory.biz.model';
import { caculateDistance, IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { ICity } from '../modules/store/entity/city/city.model';
import { STORE_ENTITIES_KEY } from '../modules/store/entity/entity.model';
import { city, filterCategory, travelAgenda, viewPoint, dailyTrip, travelViewPoint } from '../modules/store/entity/entity.schema';
import { IFilterCategory } from '../modules/store/entity/filterCategory/filterCategory.model';
import { ITravelAgenda, IDailyTrip, ITravelViewPoint } from '../modules/store/entity/travelAgenda/travelAgenda.model';
import { IViewPoint } from '../modules/store/entity/viewPoint/viewPoint.model';
import { IAppState } from '../modules/store/store.model';
import { STORE_KEY } from '../modules/store/store.model';
import { STORE_UI_CITY_KEY } from '../modules/store/ui/city/city.model';
import { STORE_UI_TRAVELAGENDA_KEY } from '../modules/store/ui/travelAgenda/travelAgenda.model';
import { STORE_UI_KEY } from '../modules/store/ui/ui.model';
import { STORE_UI_VIEWPOINT_KEY } from '../modules/store/ui/viewPoint/viewPoint.model';
import { ViewPointFilterEx } from '../utils/viewPointFilterEx';

@Injectable()
export class SelectorService {
    private viewPointSearchKeySelector$: BehaviorSubject<string> = new BehaviorSubject('');
    private viewModeSelector$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private selectedCitySelector$: BehaviorSubject<ICityBiz> = new BehaviorSubject(null);
    private selectedViewPointSelector$: BehaviorSubject<IViewPointBiz> = new BehaviorSubject(null);
    private selectedDailyTripSelector$: BehaviorSubject<IDailyTripBiz> = new BehaviorSubject(null);
    private selectedTravelAgendaSelector$: BehaviorSubject<ITravelAgendaBiz> = new BehaviorSubject(null);
    private selectedTravelViewPointSelector$: BehaviorSubject<ITravelViewPointBiz> = new BehaviorSubject(null);
    private filterAndSearchedViewPointsSelector$: BehaviorSubject<IViewPointBiz[]> = new BehaviorSubject([]);
    private currentFiltersSelector$: BehaviorSubject<IFilterCategoryBiz[]> = new BehaviorSubject([]);
    private viewPointsSelector$: BehaviorSubject<IViewPointBiz[]> = new BehaviorSubject([]);
    private citiesSelector$: BehaviorSubject<ICityBiz[]> = new BehaviorSubject([]);
    private travelAgendasSelector$: BehaviorSubject<ITravelAgendaBiz[]> = new BehaviorSubject([]);
    private filterCategoriesSelector$: BehaviorSubject<IFilterCategoryBiz[]> = new BehaviorSubject([]);

    private _selectedCity: ICityBiz;
    private _selectedDailyTrip: IDailyTripBiz;
    private _selectedTravelAgenda: ITravelAgendaBiz;
    private _selectedTravelViewPoint: ITravelViewPointBiz;
    private _selectedViewPoint: IViewPointBiz;

    public get selectedCity(): ICityBiz {
        return this._selectedCity;
    }

    public get selectedTravelAgenda(): ITravelAgendaBiz {
        return this._selectedTravelAgenda;
    }

    public get selectedViewPoint(): IViewPointBiz {
        return this._selectedViewPoint;
    }

    public get selectedDailyTrip(): IDailyTripBiz {
        return this._selectedDailyTrip;
    }

    public get selectedTravelViewPoint(): ITravelViewPointBiz {
        return this._selectedTravelViewPoint;
    }

    public get currentFilters$(): Observable<IFilterCategoryBiz[]> {
        return this.currentFiltersSelector$.asObservable();
    }
    public get selectedViewPoint$(): Observable<IViewPointBiz> {
        return this.selectedViewPointSelector$.asObservable()
    }
    public get viewPointSearchKey$(): Observable<string> {
        return this.viewPointSearchKeySelector$.asObservable();
    }
    public get viewMode$(): Observable<boolean> {
        return this.viewModeSelector$.asObservable();
    }
    public get selectedTravelAgenda$(): Observable<ITravelAgendaBiz> {
        return this.selectedTravelAgendaSelector$.asObservable();
    }
    public get selectedDailyTrip$(): Observable<IDailyTripBiz> {
        return this.selectedDailyTripSelector$.asObservable();
    }
    public get selectedTravelViewPoint$(): Observable<ITravelViewPointBiz> {
        return this.selectedTravelViewPointSelector$.asObservable()
    }
    public get selectedCity$(): Observable<ICityBiz> {
        return this.selectedCitySelector$.asObservable();
    }
    public get cities$(): Observable<ICityBiz[]> {
        return this.citiesSelector$.asObservable();
    }
    public get filterCategories$(): Observable<IFilterCategoryBiz[]> {
        return this.filterCategoriesSelector$.asObservable();
    }
    public get travelAgendas$(): Observable<ITravelAgendaBiz[]> {
        return this.travelAgendasSelector$.asObservable();
    }
    public get filterAndSearchedViewPoints$(): Observable<IViewPointBiz[]> {
        return this.filterAndSearchedViewPointsSelector$.asObservable();
    }

    constructor(private _store: NgRedux<IAppState>) {
        this.getViewPoints(this._store).subscribe((value) => {
            this.viewPointsSelector$.next(value);
        });
        this.getTravelAgendas(this._store).subscribe((value) => {
            this.travelAgendasSelector$.next(value);
        })
        this.getFilterCategories(this._store).subscribe((value) => {
            this.filterCategoriesSelector$.next(value);
        })
        this.getCities(this._store).subscribe((value) => {
            this.citiesSelector$.next(value);
        })
        this.getSelectedCity(this._store).subscribe((value) => {
            this._selectedCity = value;
            this.selectedCitySelector$.next(value);
        })
        this.getSelectedViewPoint(this._store).subscribe((value) => {
            this._selectedViewPoint = value;
            this.selectedViewPointSelector$.next(value);
        })
        this.getSelectedDailyTrip(this._store).subscribe((value) => {
            this._selectedDailyTrip = value;
            this.selectedDailyTripSelector$.next(value);
        })
        this.getSelectedTravelAgenda(this._store).subscribe((value) => {
            this._selectedTravelAgenda = value;
            this.selectedTravelAgendaSelector$.next(value);
        })
        this.getSelectedTravelViewPoint(this._store).subscribe((value) => {
            this._selectedTravelViewPoint = value;
            this.selectedTravelViewPointSelector$.next(value);
        })
        this.getViewMode(this._store).subscribe((value) => {
            this.viewModeSelector$.next(value);
        })
        this.getCurrentFilters(this._store).subscribe((value) => this.currentFiltersSelector$.next(value));
        this.getFilterAndSearchedViewPoints(this._store).subscribe((value) => {
            this.filterAndSearchedViewPointsSelector$.next(value);
        })
        this.getViewPointSearchKey(this._store).subscribe(value => this.viewPointSearchKeySelector$.next(value));
        this.getSelectedViewPoint(this._store).subscribe(value => this.selectedViewPointSelector$.next(value));
    }

    //#region Entities Selector
    private getCities(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return store.select<{ [id: string]: ICity }>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities])
            .map((data) => {
                return denormalize(Object.keys(data), [city], Immutable(store.getState().entities).asMutable({ deep: true }));
            });
    }

    private getFilterCategories(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
        return store.select<{ [id: string]: IFilterCategory }>([STORE_KEY.entities, 'filterCategories'])
            .map((data) => {
                return denormalize(Object.keys(data), [filterCategory], Immutable(store.getState().entities).asMutable({ deep: true }));
            });
    }

    private getViewPoints(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
        return store.select<{ [id: string]: IViewPoint }>([STORE_KEY.entities, STORE_ENTITIES_KEY.viewPoints])
            .map((data) => {
                return denormalize(Object.keys(data), [viewPoint], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
    }

    private getTravelAgendas(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz[]> {
        return store.select<{ [id: string]: ITravelAgenda }>([STORE_KEY.entities, STORE_ENTITIES_KEY.travelAgendas])
            .map((data) => {
                let ret = denormalize(Object.keys(data), [travelAgenda], Immutable(store.getState().entities).asMutable({ deep: true }));

                ret.forEach(ta => {
                    ta.dailyTrips.forEach(dt => {
                        caculateDistance(dt);
                    })
                })

                return ret;
            })
    }

    //#endregion

    //#region UI Selector

    //#region Selected City
    private getSelectedCityId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.city, STORE_UI_CITY_KEY.selectedCityId]);
    }

    private getSelectedCity(store: NgRedux<IAppState>): Observable<ICityBiz> {
        return this.getSelectedCityId(store)
            .map(id => {
                return store.select<ICity>([STORE_KEY.entities, STORE_ENTITIES_KEY.cities, id]);
            })
            .switch()
            .map(ct => {
                return ct ? denormalize(ct.id, city, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
    }
    //#endregion

    //#region Selected DailyTrip
    private getSelectedDailyTripId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.travelAgenda, STORE_UI_TRAVELAGENDA_KEY.selectedDailyTripId]);
    }

    private getSelectedDailyTrip(store: NgRedux<IAppState>): Observable<IDailyTripBiz> {
        return this.getSelectedDailyTripId(store)
            .map(id => {
                return store.select<IDailyTrip>([STORE_KEY.entities, STORE_ENTITIES_KEY.dailyTrips, id]);
            })
            .switch()
            .map(dt => {
                let ret = dt ? denormalize(dt.id, dailyTrip, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
                if (ret) caculateDistance(ret);
                return ret;
            })
    }
    //#endregion

    //#region Selected TravelAgenda
    private getSelectedTravelAgendaId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.travelAgenda, STORE_UI_TRAVELAGENDA_KEY.selectedTravelAgendaId]);
    }

    private getSelectedTravelAgenda(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz> {
        return this.getSelectedTravelAgendaId(store)
            .map(id => {
                return store.select<ITravelAgenda>([STORE_KEY.entities, STORE_ENTITIES_KEY.travelAgendas, id]);
            })
            .switch()
            .map(ta => {
                return ta ? denormalize(ta.id, travelAgenda, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
    }
    //#endregion

    //#region Selected TravelViewPoint
    private getSelectedTravelViewPointId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.travelAgenda, STORE_UI_TRAVELAGENDA_KEY.selectedTravelViewPointId]);
    }

    private getSelectedTravelViewPoint(store: NgRedux<IAppState>): Observable<ITravelViewPointBiz> {
        return this.getSelectedTravelViewPointId(store)
            .map(id => {
                return store.select<ITravelViewPoint>([STORE_KEY.entities, STORE_ENTITIES_KEY.travelViewPoints, id]);
            })
            .switch()
            .map(ta => {
                return ta ? denormalize(ta.id, travelViewPoint, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
    }
    //#endregion

    //#region Selected ViewPoint
    private getSelectedViewPointId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_VIEWPOINT_KEY.selectedViewPointId]);
    }

    private getSelectedViewPoint(store: NgRedux<IAppState>): Observable<IViewPointBiz> {
        return this.getSelectedViewPointId(store)
            .map(id => {
                return store.select<IViewPoint>([STORE_KEY.entities, STORE_ENTITIES_KEY.viewPoints, id]);
            })
            .switch()
            .map(vp => {
                return vp ? denormalize(vp.id, viewPoint, Immutable(store.getState().entities).asMutable({ deep: true })) : null;
            })
    }
    //#endregion

    //#region ViewMode
    private getViewMode(store: NgRedux<IAppState>): Observable<boolean> {
        return store.select<boolean>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_VIEWPOINT_KEY.viewMode]);
    }
    //#endregion

    //#region Filtered ViewPoints
    private getCurrentFilters(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
        return this.getFilterCriteriaIds(store).combineLatest(this.filterCategories$, (v1, v2) => {
            return this.buildCurrentFilterCategories(v1, v2);
        });
    }

    private getFilterCriteriaIds(store: NgRedux<IAppState>): Observable<string[]> {
        return store.select<string[]>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_VIEWPOINT_KEY.filterCriteriaIds])
    }

    private buildCurrentFilterCategories(checkIds: string[], categories: IFilterCategoryBiz[]) {
        categories.forEach(category => {
            category.criteries.forEach(criteria => {
                criteria.isChecked = !!checkIds.find(id => id === criteria.id);
            })
        });

        return categories;
    }

    private getFilterAndSearchedViewPoints(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
        return this.currentFiltersSelector$.combineLatest(this.viewPointsSelector$,this.viewPointSearchKey$, (filterCategories, viewPoints,searchKey) => {
            return viewPoints.filter(viewPoint => {
                let isFiltered = filterCategories.every(category => {
                    return category.criteries.every(criteria => {
                        if (criteria.isChecked && ViewPointFilterEx[category.filterFunction])
                            return ViewPointFilterEx[category.filterFunction](viewPoint, criteria);
                        return true;
                    })
                });

                let matchSearchKey = true;
                if (searchKey != '')
                    matchSearchKey = viewPoint.name.indexOf(searchKey) != -1 ||
                                    viewPoint.tags.findIndex((value) => value == searchKey) != -1;

                return isFiltered && matchSearchKey;
            });
        });
    }
    //#endregion

    //#region ViewPoint Search Key
    private getViewPointSearchKey(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>([STORE_KEY.ui, STORE_UI_KEY.viewPoint, STORE_UI_VIEWPOINT_KEY.searchKey]);
    }
    //#endregion

    //#endregion

}