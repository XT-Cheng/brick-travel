import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IAppState, IError, STORE_KEY } from '../store.model';

@Injectable()
export class ErrorService {
    //#region private member

    private _errorSelector$: BehaviorSubject<IError> = new BehaviorSubject(null);

    //#endregion

    //#region Constructor
    constructor(protected _store: NgRedux<IAppState>) {
        this.getError(this._store).subscribe((value) => {
            this._errorSelector$.next(value);
        });
    }
    //#endregion

    //#region public methods

    public get error$(): Observable<IError> {
        return this._errorSelector$.asObservable();
    }

    //#endregion

    //#region Error Selector

    private getError(store: NgRedux<IAppState>): Observable<IError> {
        return store.select<IError>([STORE_KEY.error]);
    }

    //#endregion
}
