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

@NgModule({
    imports: [NgReduxModule, HttpModule, IonicStorageModule]
})
export class StoreModule {
    constructor(@Optional() @SkipSelf() parentModule: StoreModule,
        private _store: NgRedux<IAppState>, private _rootEpics: RootEpics,
        private _cityService : CityService,
        private _dataSync: DataSyncService) {

        throwIfAlreadyLoaded(parentModule, 'StoreModule');

        this._dataSync.restoreState().then((restoredState) => {
            this._store.configureStore(
                rootReducer,
                <any>Immutable(deepExtend(INIT_APP_STATE, restoredState)),
                [createLogger({ stateTransformer: stateTransformer }),
                createEpicMiddleware(this._rootEpics.createEpics())]);

            this._cityService.load();
            this._dataSync.stateRestored();
            
            //TODO: When data sync should happen?
            this._store.select<Error>(['dirties', 'lastError']).filter((err)=> {
                return err !== null;
            }).debounceTime(60000)
            .subscribe(() => {
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
