import { NgModule, Optional, SkipSelf, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbAuthModule, NB_AUTH_TOKEN_CLASS, NbAuthJWTToken, NbTokenStorage } from "@nebular/auth";
import { throwIfAlreadyLoaded } from "../utils/module-import-guard";
import { CustomAuthProvider } from "./providers/custom-auth.provider";
import { WEBAPI_HOST } from "../utils/constants";
import { TokenCustomLocalStorage } from "./providers/tokenLocalStorage";
import { AuthRoutingModule } from "./auth-routing.module";

const formSetting: any = {
    provider: 'custom',
    redirectDelay: 0,
    showMessages: {
        success: true,
    },
};

const CORE_PROVIDERS = [
    CustomAuthProvider,
    ...NbAuthModule.forRoot({
        providers: {
            custom: {
                service: CustomAuthProvider,
                config: {
                    delay: 3000,
                    baseEndpoint: WEBAPI_HOST,
                    login: {
                        rememberMe: true,
                        endpoint: '/auth/login',
                        method: 'post'
                    },
                    token: {
                        key: 'idToken'
                    },
                    errors: {
                        key: 'errors'
                    }
                },
            },
        },
        forms: {
            login: formSetting,
            register: formSetting,
            requestPassword: formSetting,
            resetPassword: formSetting,
            logout: formSetting
        }
    }).providers,
    { provide: NB_AUTH_TOKEN_CLASS, useValue: NbAuthJWTToken },
    { provide: NbTokenStorage, useClass: TokenCustomLocalStorage }
];

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule
    ],
    declarations: [],
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