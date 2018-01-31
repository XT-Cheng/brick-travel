import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { denormalize } from 'normalizr';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as Immutable from 'seamless-immutable';

import { ICityBiz } from '../bizModel/model/city.biz.model';
import { IFilterCategoryBiz } from '../bizModel/model/filterCategory.biz.model';
import { caculateDistance, IDailyTripBiz, ITravelAgendaBiz } from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { ICity } from '../modules/store/entity/city/city.model';
import { city, filterCategory, travelAgenda, viewPoint } from '../modules/store/entity/entity.schema';
import { IFilterCategory } from '../modules/store/entity/filterCategory/filterCategory.model';
import { ITravelAgenda } from '../modules/store/entity/travelAgenda/travelAgenda.model';
import { IViewPoint } from '../modules/store/entity/viewPoint/viewPoint.model';
import { IAppState } from '../modules/store/store.model';
import { ViewPointFilterEx } from '../utils/viewPointFilterEx';

@Injectable()
export class SelectorService {
    private viewPointSearchKeySelector: BehaviorSubject<string> = new BehaviorSubject('');
    private viewModeSelector: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private selectedCitySelector: BehaviorSubject<ICityBiz> = new BehaviorSubject(null);
    private selectedViewPointSelector: BehaviorSubject<IViewPointBiz> = new BehaviorSubject(null);
    private selectedDailyTripSelector: BehaviorSubject<IDailyTripBiz> = new BehaviorSubject(null);
    private selectedTravelAgendaSelector: BehaviorSubject<ITravelAgendaBiz> = new BehaviorSubject(null);
    private filteredViewPointsSelector: BehaviorSubject<IViewPointBiz[]> = new BehaviorSubject([]);
    private currentFiltersSelector: BehaviorSubject<IFilterCategoryBiz[]> = new BehaviorSubject([]);
    private viewPointsSelector: BehaviorSubject<IViewPointBiz[]> = new BehaviorSubject([]);
    private citiesSelector: BehaviorSubject<ICityBiz[]> = new BehaviorSubject([]);
    private travelAgendasSelector: BehaviorSubject<ITravelAgendaBiz[]> = new BehaviorSubject([]);
    private filterCategoriesSelector: BehaviorSubject<IFilterCategoryBiz[]> = new BehaviorSubject([]);

    public get currentFilters(): Observable<IFilterCategoryBiz[]> {
        return this.currentFiltersSelector.asObservable();
    }
    public get selectedViewPoint(): Observable<IViewPointBiz> {
        return this.selectedViewPointSelector.asObservable()
    }
    public get viewPointSearchKey(): Observable<string> {
        return this.viewPointSearchKeySelector.asObservable();
    }
    public get viewMode(): Observable<boolean> {
        return this.viewModeSelector.asObservable();
    }
    public get selectedTravelAgenda(): Observable<ITravelAgendaBiz> {
        return this.selectedTravelAgendaSelector.asObservable();
    }
    public get selectedDailyTrip(): Observable<IDailyTripBiz> {
        return this.selectedDailyTripSelector.asObservable();
    }
    public get selectedCity(): Observable<ICityBiz> {
        return this.selectedCitySelector.asObservable();
    }
    public get cities(): Observable<ICityBiz[]> {
        return this.citiesSelector.asObservable();
    }
    public get filterCategories(): Observable<IFilterCategoryBiz[]> {
        return this.filterCategoriesSelector.asObservable();
    }
    public get viewPoints(): Observable<IViewPointBiz[]> {
        return this.viewPointsSelector.asObservable();
    }
    public get travelAgendas(): Observable<ITravelAgendaBiz[]> {
        return this.travelAgendasSelector.asObservable();
    }
    public get filteredViewPoints(): Observable<IViewPointBiz[]> {
        return this.filteredViewPointsSelector.asObservable();
    }

    constructor(private _store: NgRedux<IAppState>) {
        this.getViewPoints(this._store).subscribe((value) => {
            this.viewPointsSelector.next(value);
        });
        this.getTravelAgendas(this._store).subscribe((value) => {
            this.travelAgendasSelector.next(value);
        })
        this.getFilterCategories(this._store).subscribe((value) => {
            this.filterCategoriesSelector.next(value);
        })
        this.getCities(this._store).subscribe((value) => {
            this.citiesSelector.next(value);
        })
        this.getSelectedCity(this._store).subscribe((value) => {
            this.selectedCitySelector.next(value);
        })
        this.getSelectedDailyTrip(this._store).subscribe((value) => {
            this.selectedDailyTripSelector.next(value);
        })
        this.getSelectedTravelAgenda(this._store).subscribe((value) => {
            this.selectedTravelAgendaSelector.next(value);
        })
        this.getViewMode(this._store).subscribe((value) => {
            this.viewModeSelector.next(value);
        })
        this.getCurrentFilters(this._store).subscribe((value) => this.currentFiltersSelector.next(value));
        this.getFilteredViewPoints(this._store).subscribe((value) => {
            this.filteredViewPointsSelector.next(value);
        })
        this.getViewPointSearchKey(this._store).subscribe(value => this.viewPointSearchKeySelector.next(value));
        this.getSelectedViewPoint(this._store).subscribe(value => this.selectedViewPointSelector.next(value));
    }

    //#region Entities Selector
    private getCities(store: NgRedux<IAppState>): Observable<ICityBiz[]> {
        return store.select<{ [id: string]: ICity }>(['entities', 'cities'])
            .map((data) => {
                return denormalize(Object.keys(data), [city], Immutable(store.getState().entities).asMutable({ deep: true }));
            });
    }

    private getFilterCategories(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
        return store.select<{ [id: string]: IFilterCategory }>(['entities', 'filterCategories'])
            .map((data) => {
                return denormalize(Object.keys(data), [filterCategory], Immutable(store.getState().entities).asMutable({ deep: true }));
            });
    }

    private getViewPoints(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
        return store.select<{ [id: string]: IViewPoint }>(['entities', 'viewPoints'])
            .map((data) => {
                return denormalize(Object.keys(data), [viewPoint], Immutable(store.getState().entities).asMutable({ deep: true }));
            })
    }

    private getTravelAgendas(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz[]> {
        return store.select<{ [id: string]: ITravelAgenda }>(['entities', 'travelAgendas'])
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
        return store.select<string>(['ui', 'city', 'selectedCityId']);
    }

    private getCityById(cityId: string, cities: ICityBiz[]): ICityBiz {
        let found = null;
        cities.forEach(city => {
            if (city.id === cityId) {
                found = city;
            }
        })
        return found;
    }

    private getSelectedCity(store: NgRedux<IAppState>): Observable<ICityBiz> {
        return this.getSelectedCityId(store).combineLatest(this.cities, (v1, v2) => {
            return this.getCityById(v1, v2);
        });
    }
    //#endregion

    //#region Selected DailyTrip
    private getSelectedDailyTripId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>(['ui', 'travelAgenda', 'selectedDailyTripId']);
    }

    private getDailyTripById(dailyTripId: string, travelAgendas: ITravelAgendaBiz[]): IDailyTripBiz {
        let found = null;
        travelAgendas.forEach(agenda => {
            agenda.dailyTrips.forEach(dailyTrip => {
                if (dailyTrip.id === dailyTripId) {
                    found = dailyTrip;
                }
            })
        })
        return found;
    }

    private getSelectedDailyTrip(store: NgRedux<IAppState>): Observable<IDailyTripBiz> {
        return this.getSelectedDailyTripId(store).combineLatest(this.travelAgendas, (v1, v2) => {
            return this.getDailyTripById(v1, v2);
        });
    }
    //#endregion

    //#region Selected TravelAgenda
    private getSelectedTravelAgendaId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>(['ui', 'travelAgenda', 'selectedTravelAgendaId']);
    }

    private getTravelAgendaById(agendaId: string, agendas: ITravelAgendaBiz[]) {
        return agendas.find(agenda => agenda.id === agendaId);
    }

    private getSelectedTravelAgenda(store: NgRedux<IAppState>): Observable<ITravelAgendaBiz> {
        return this.getSelectedTravelAgendaId(store).combineLatest(this.travelAgendas, (v1, v2) => {
            return this.getTravelAgendaById(v1, v2);
        });
    }
    //#endregion

    //#region Selected ViewPoint
    private getSelectedViewPointId(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>(['ui', 'viewPoint', 'selectedViewPointId']);
    }

    private getViewPointById(viewPointId: string, viewPoints: IViewPointBiz[]): IViewPointBiz {
        let found = null;
        viewPoints.forEach(viewPoint => {
            if (viewPoint.id === viewPointId) {
                found = viewPoint;
            }
        })
        return found;
    }

    private getSelectedViewPoint(store: NgRedux<IAppState>): Observable<IViewPointBiz> {
        return this.getSelectedViewPointId(store).combineLatest(this.viewPoints, (v1, v2) => {
            return this.getViewPointById(v1, v2);
        });
    }
    //#endregion

    //#region ViewMode
    private getViewMode(store: NgRedux<IAppState>): Observable<boolean> {
        return store.select<boolean>(['ui', 'viewMode']);
    }
    //#endregion

    //#region Filtered ViewPoints
    private getCurrentFilters(store: NgRedux<IAppState>): Observable<IFilterCategoryBiz[]> {
        return this.getFilterCriteriaIds(store).combineLatest(this.filterCategories, (v1, v2) => {
            return this.buildCurrentFilterCategories(v1, v2);
        });
    }

    private getFilterCriteriaIds(store: NgRedux<IAppState>): Observable<string[]> {
        return store.select<string[]>(['ui', 'viewPoint', 'filterCriteriaIds'])
    }

    private buildCurrentFilterCategories(checkIds: string[], categories: IFilterCategoryBiz[]) {
        categories.forEach(category => {
            category.criteries.forEach(criteria => {
                criteria.isChecked = !!checkIds.find(id => id === criteria.id);
            })
        });

        return categories;
    }

    private getFilteredViewPoints(store: NgRedux<IAppState>): Observable<IViewPointBiz[]> {
        return this.getCurrentFilters(store).combineLatest(this.viewPoints, (filterCategories, viewPoints) => {
            return viewPoints.filter(viewPoint => {
                return filterCategories.every(category => {
                    return category.criteries.every(criteria => {
                        if (criteria.isChecked && ViewPointFilterEx[category.filterFunction])
                            return ViewPointFilterEx[category.filterFunction](viewPoint, criteria);
                        return true;
                    })
                })
            });
        });
    }
    //#endregion

    //#region ViewPoint Search Key
    private getViewPointSearchKey(store: NgRedux<IAppState>): Observable<string> {
        return store.select<string>(['ui', 'viewPoint', 'searchKey']);
    }
    //#endregion

    //#endregion

}