import { NgModule } from '@angular/core';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
import { NgReduxModule, NgRedux } from '@angular-redux/store';

// Redux ecosystem stuff.
import { stateTransformer } from 'redux-seamless-immutable'
import { createLogger } from 'redux-logger';
import { HttpModule } from '@angular/http';

// The top-level reducers and epics that make up our app's logic.
import { rootReducer } from './store.reducer';
import { RootEpics } from './store.epic';
import { CityService } from './city/city.service';
import { CityEpic } from './city/city.epic';
import { CityAction } from './city/city.action';
import { IAppState, INIT_ENTITY_STATE } from './store.model';
import { ViewPointAction } from './viewPoint/viewPoint.action';
import { ViewPointService } from './viewPoint/viewPoint.service';
import { ViewPointEpic } from './viewPoint/viewPoint.epic';
import { TravelAgendaService } from './travelAgenda/travelAgenda.service';
import { TravelAgendaEpic } from './travelAgenda/travelAgenda.epic';
import { TravelAgendaAction } from './travelAgenda/travelAgenda.action';
import { FilterCategoryService } from './filterCategory/filterCategory.service';
import { FilterCategoryEpic } from './filterCategory/filterCategory.epic';
import { FilterCategoryAction } from './filterCategory/filterCategory.action';

@NgModule({
    imports: [NgReduxModule,HttpModule],
    providers: [RootEpics,
                CityService,CityEpic,CityAction,
                ViewPointService,ViewPointEpic,ViewPointAction,
                TravelAgendaService,TravelAgendaEpic,TravelAgendaAction,
                FilterCategoryService,FilterCategoryEpic,FilterCategoryAction],
})
export class StoreModule {
    constructor(private _store: NgRedux<IAppState>,private _rootEpics: RootEpics) {
        this._store.configureStore(
            rootReducer,
            Object.assign({},{entities: INIT_ENTITY_STATE,error: null,progress: {progressing: false}}),
            [createLogger({stateTransformer: stateTransformer}), ...this._rootEpics.createEpics()]);
    }
}
