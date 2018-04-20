import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';

import { throwIfAlreadyLoaded } from '../utils/module-import-guard';
import { IAppState } from './store.model';

export enum EntityTypeEnum {
    CITY = 'CITY',
}

@NgModule({
    imports: [NgReduxModule, HttpClientModule, IonicStorageModule]
})
export class StoreModule {
    constructor(@Optional() @SkipSelf() parentModule: StoreModule,
        private _store: NgRedux<IAppState>) {
        throwIfAlreadyLoaded(parentModule, 'StoreModule');
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: StoreModule,
            providers: [
            ]
        };
    }
}
