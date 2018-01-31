import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { stateTransformer } from 'redux-seamless-immutable';

import { CityService } from '../../providers/city.service';
import { FilterCategoryService } from '../../providers/filterCategory.service';
import { ViewPointService } from '../../providers/viewPoint.service';
import { EntityEpics } from './entity/entity.epic';
import { TravelAgendaActionGenerator } from './entity/travelAgenda/travelAgenda.action';
import { TravelAgendaEpic } from './entity/travelAgenda/travelAgenda.epic';
import { TravelAgendaService } from './entity/travelAgenda/travelAgenda.service';
import { RootEpics } from './store.epic';
import { IAppState } from './store.model';
import { rootReducer } from './store.reducer';
import { UIActionGenerator } from './ui/ui.action';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
// Redux ecosystem stuff.
// The top-level reducers and epics that make up our app's logic.
@NgModule({
    imports: [NgReduxModule,HttpModule],
    providers: [RootEpics,EntityEpics,
                CityService,
                ViewPointService,
                TravelAgendaService,TravelAgendaEpic,TravelAgendaActionGenerator,
                FilterCategoryService,
                UIActionGenerator],
})
export class StoreModule {
    constructor(private _store: NgRedux<IAppState>,private _rootEpics: RootEpics) {
        this._store.configureStore(
            rootReducer,
            <IAppState>{},
            [createLogger({stateTransformer: stateTransformer}), createEpicMiddleware(this._rootEpics.createEpics())]);
    }
}
