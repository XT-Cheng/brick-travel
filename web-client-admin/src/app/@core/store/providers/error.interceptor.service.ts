import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { catchError } from 'rxjs/operators';

import { IError } from '../error/error.model';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req);
        return next.handle(req).pipe(
            catchError((errResponse: any) => {
                let err: IError;
                if (errResponse.error instanceof ErrorEvent) {
                    err = {
                        actionId: '',
                        description: errResponse.error.message,
                        stack: '',
                        network: true
                    };
                } else if (errResponse.error instanceof ProgressEvent) {
                    err = {
                        actionId: '',
                        description: '',
                        stack: '',
                        network: true
                    };
                } else {
                    err = {
                        actionId: '',
                        description: errResponse.error,
                        stack: '',
                        network: false
                    };
                }
                errResponse.actionError = err;
                return _throw(errResponse);
            })
        );
    }
}
