import { NgModule, Optional, SkipSelf, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { throwIfAlreadyLoaded } from "../utils/module-import-guard";
import { WEBAPI_HOST } from "../utils/constants";
import { AuthService } from "./providers/authService";
import { TokenStorage } from "./providers/tokenStorage";
import { TokenService } from "./providers/tokenService";

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