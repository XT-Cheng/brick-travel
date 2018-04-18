import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { throwIfAlreadyLoaded } from '../utils/module-import-guard';
import { AuthService } from './providers/authService';
import { TokenService } from './providers/tokenService';
import { TokenStorage } from './providers/tokenStorage';

const CORE_PROVIDERS = [
    AuthService,
    TokenService,
    TokenStorage
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: []
})
export class AuthModule {
    constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
        throwIfAlreadyLoaded(parentModule, 'AuthModule');
    }

    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders>{
            ngModule: AuthModule,
            providers: [
                ...CORE_PROVIDERS,
            ],
        };
    }
}
