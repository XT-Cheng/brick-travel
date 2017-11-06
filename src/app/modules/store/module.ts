import { NgModule } from '@angular/core';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
import { NgReduxModule, NgRedux } from '@angular-redux/store';

// Redux ecosystem stuff.
import { createLogger } from 'redux-logger';

// The top-level reducers and epics that make up our app's logic.
import { IAppState } from './models';
import { rootReducer } from './reducers';
import { RootEpics } from './epics';

@NgModule({
    imports: [NgReduxModule],
    providers: [RootEpics],
})
export class StoreModule {
    constructor(public store: NgRedux<IAppState>,
        rootEpics: RootEpics, ) {
        store.configureStore(
            rootReducer,
            {cities: null},
            [createLogger(), ...rootEpics.createEpics()]);
    }
}
