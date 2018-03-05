import { NbTokenLocalStorage, NbTokenStorage, NbAuthToken, nbCreateToken, NbTokenClass, NbAuthJWTToken, NB_AUTH_TOKEN_CLASS, NbAuthService, NbTokenService } from "@nebular/auth";
import { Injectable, Inject } from "@angular/core";
import { Storage } from '@ionic/storage';

@Injectable()
export class TokenCustomLocalStorage implements NbTokenStorage {
    public static TOKEN_KEY : string = 'auth_app_token';
    private _value : NbAuthToken;

    constructor(private _storage : Storage, @Inject(NB_AUTH_TOKEN_CLASS) private _tokenClass : NbTokenClass) {
    }

    get() : NbAuthToken {
       return this._value;
    }

    set(token: NbAuthToken): void {
        this._value = token;
        this._storage.set(TokenCustomLocalStorage.TOKEN_KEY,token.toString());
    }

    setRaw(token: string) {
        this._value = nbCreateToken(this._tokenClass,token);
        this._storage.set(TokenCustomLocalStorage.TOKEN_KEY,token);
    }
    
    clear(): void {
        this._value = null;
        this._storage.remove(TokenCustomLocalStorage.TOKEN_KEY);
    }
}