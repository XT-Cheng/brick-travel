import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { stateTransformer } from 'redux-seamless-immutable';
import * as Immutable from 'seamless-immutable';

import { deepExtend } from '../utils/helpers';
import { DirtyEpics } from './dirty/drity.epic';
import { EntityEpics } from './entity/entity.epic';
import { CityService } from './providers/city.service';
import { DataSyncService } from './providers/dataSync.service';
import { FilterCategoryService } from './providers/filterCategory.service';
import { SelectorService } from './providers/selector.service';
import { TravelAgendaService } from './providers/travelAgenda.service';
import { UserService } from './providers/user.service';
import { ViewPointService } from './providers/viewPoint.service';
import { RootEpics } from './store.epic';
import { IAppState, INIT_APP_STATE } from './store.model';
import { rootReducer } from './store.reducer';
import { throwIfAlreadyLoaded } from '../utils/module-import-guard';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
// Redux ecosystem stuff.
// The top-level reducers and epics that make up our app's logic.
@NgModule({
    imports: [NgReduxModule, HttpModule, IonicStorageModule]
})
export class StoreModule {
    constructor(@Optional() @SkipSelf() parentModule: StoreModule,
        private _store: NgRedux<IAppState>, private _rootEpics: RootEpics,
        private _dataSync: DataSyncService) {

        throwIfAlreadyLoaded(parentModule, 'StoreModule');

        this._dataSync.restoreState().then((restoredState) => {
            this._store.configureStore(
                rootReducer,
                <any>Immutable(deepExtend(INIT_APP_STATE, restoredState)),
                [createLogger({ stateTransformer: stateTransformer }),
                createEpicMiddleware(this._rootEpics.createEpics())]);

            this._dataSync.stateRestored();

            this._store.select(['dirties', 'dirtyIds']).subscribe(() => {
                this._dataSync.syncData();
            })
        });
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: StoreModule,
            providers: [
                RootEpics,
                EntityEpics,
                DirtyEpics,
                SelectorService,
                FilterCategoryService,
                CityService,
                ViewPointService,
                TravelAgendaService,
                UserService,
                DataSyncService
            ]
        };
    }
}
