import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of as observableOf } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';
import { AUTH_METHOD, WEBAPI_HOST, AUTH_URL, AUTH_SUCCESS_REDIRECT, AUTH_MESSAGE_KEY, AUTH_ERRORS_KEY, AUTH_FAIL_REDIRECT } from '../../utils/constants';
import { getDeepFromObject } from '../../utils/helpers';
import { AuthResult } from './authResult';
import { TokenStorage } from './tokenStorage';
import { AuthToken } from './authToken';
import { TokenService } from './tokenService';

@Injectable()
export class AuthService {

  constructor(protected http: HttpClient,
    protected tokenService: TokenService,) {
  }

  /**
   * Retrieves current authenticated token stored
   * @returns {Observable<any>}
   */
  getToken(): Observable<AuthToken> {
    return this.tokenService.get();
  }

  /**
   * Returns true if auth token is presented in the token storage
   * @returns {Observable<any>}
   */
  isAuthenticated(): Observable<boolean> {
    return this.getToken()
      .pipe(map((token: AuthToken) => token.isValid()));
  }

  /**
   * Returns tokens stream
   * @returns {Observable<NbAuthSimpleToken>}
   */
  onTokenChange(): Observable<AuthToken> {
    return this.tokenService.tokenChange();
  }

  /**
   * Returns authentication status stream
   * @returns {Observable<boolean>}
   */
  onAuthenticationChange(): Observable<boolean> {
    return this.onTokenChange()
      .pipe(map((token: AuthToken) => token.isValid()));
  }

  authenticate(data?: any): Observable<AuthResult> {
    const method = AUTH_METHOD;
    const url = `${WEBAPI_HOST}${AUTH_URL}`;

    return this.http.request(method, url, {body: data, observe: 'response'})
      .pipe(
        this.validateToken(),
        map((res : HttpResponse<Object>) => {
          return new AuthResult(
            true,
            res,
            AUTH_SUCCESS_REDIRECT,
            [],
            getDeepFromObject(res.body,
              AUTH_MESSAGE_KEY,
                  'You have been successfully logged in.'),
            getDeepFromObject(res.body,
                         TokenStorage.TOKEN_KEY));
        }),
        catchError((res : any) => {
          let errors = [];
          if (res instanceof HttpErrorResponse) {
            errors = getDeepFromObject(res.error,
              AUTH_ERRORS_KEY,
                  'Login/Email combination is not correct, please try again.');
          } else {
            errors.push('Something went wrong.');
          }

          return observableOf(
            new AuthResult(
              false,
              res,
              AUTH_FAIL_REDIRECT,
              errors,
            ));
        }),
      );
  }

  protected validateToken (): any {
    return map((res : HttpResponse<Object>) => {
      const token = getDeepFromObject(res.body,TokenStorage.TOKEN_KEY)
      if (!token) {
        throw new Error('Could not extract token from the response.');
      }
      return res;
    });
  }
}
