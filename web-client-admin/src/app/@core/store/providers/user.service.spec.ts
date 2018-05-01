import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { initTest } from '../../../../test';
import { AuthService } from '../../auth/providers/authService';
import { ErrorService } from './error.service';
import { UserService } from './user.service';

const loginData = {
    username: 'cxt',
    password: 'cxt'
};

const loginRes = {
    auth_app_token: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3h0IiwibmljayI6ImFkbWluIiwicGljdHVyZSI6ImFzc2V0cy9pb
    WcvamFjay5wbmciLCJpZCI6IjVhNGI1NzU2NzY0ZmJhMmM4MGVmNWJhYiIsImlhdCI6MTUyNDk3Nzg0MSwic3ViIjoiY3h0In0.UrTnwhRaQrsl6i6KvjHc
    JkXhoKNpdPWpk2A-Dti2wJly6Qm0EyhrIFcB9rEizphgPUPrqUXOw7n9hPSqgbPlK54mR3KXHGMSoKr2y1ELEmPwOmd2AZ3KRX0Nn4kYxHYCFuCsWWGJyDU
    k4DlcJ74l25P0Z7XdGn51fTzn0TFKestq0BrLsDwvjeVH1s7KCSSqCD9soAo_UochNoJv_2cDTthtrRJg7yw8dMHFMSG-JHGkBcIYSPOd0N9eWl4Y2hyvcS
    PZrQ6Jp8wmA-skUImYba8syeZZKuaqX4hLU-Ev8Q2uiXgUf4xzwVZcbLcrxjhRX2Ksh6SRON-7JNPxSE5up_Qob13J7wdWo3pwM6rFxCSchbPDMYEuW8LrI
    7Z4yKpE34Zl4WCOfsoy4bhbFPIjcELiKZsZ7LS_mo4qLGebHIDZiZGSWz9p5zyS8PVBHBJMbwBhP0Uq52ksgSeItU5jBvPmFRaqDLuBowgaJ5vK8R6Kr8RM
    WDODYoNasQYelBIIbjQphmulzRrVUJvyXng7SAGYMJOr2oYyuD7OevPQIpZN9GmiasQALh7HH3JeNOmjump2sPRmXnSeoJl5jQ6it8FrxkyCwTH3tdOEqBD
    crcZM8DfplL-_EzD36wBLVFKs2Q9ed0ij6JbtCZDzprIAV0ToBfqvWzshyznwSdV0xBE`
};

const userData = [
    {
        name: 'cxt',
        picture: 'assets/img/jack.png',
        nick: 'admin',
        id: '5a4b5756764fba2c80ef5bab'
    }
];

const updateData = {
    name: 'cxt1',
    picture: 'assets/img/jack.png',
    nick: 'admin',
    id: '5a4b5756764fba2c80ef5bab'
};

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: UserService;
let auth: AuthService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('user test', () => {
    beforeEach(() => {
        initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(UserService);
        auth = TestBed.get(AuthService);
        errorService = TestBed.get(ErrorService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch - Success', () => {
            const provided = service.all$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: userData,
                    b: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);

            expect(provided).toBeObservable(expected);
        });
        it('#byId - Success', () => {
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);

            expect(service.byId(userData[0].id)).toEqual(userData[0]);
        });
        it('#fetch - Failed with backend error', () => {
            const provided = errorService.error$.pipe(
                merge(service.all$)
            );

            const expected = cold('(ba)',
                {
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    },
                    a: []
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush('error happened', errorData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with network error', () => {
            const provided = errorService.error$.pipe(
                merge(service.all$)
            );

            const expected = cold('(ba)',
                {
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    },
                    a: []
                });

            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.error(new ErrorEvent('network error'));


            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Success after Failed', () => {
            const provided = errorService.error$.pipe(
                merge(service.all$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: userData
                });

            service.fetch();

            let req = httpTestingController.expectOne('http://localhost:3000/users');

            req.error(new ErrorEvent('network error'));

            service.fetch();

            req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);

            expect(provided).toBeObservable(expected);
        });
    });

    describe('add test', () => {
        it('#add - Success', () => {
            const provided = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: userData,
                    b: null
                });

            service.add(userData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);

            expect(provided).toBeObservable(expected);
        });

        it('#add - Failed with backend error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.add(userData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#add - Failed with network error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.add(userData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#add - Success after Failed', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: userData,
                    b: null
                });

            service.add(userData[0]);

            let req = httpTestingController.expectOne('http://localhost:3000/users');

            req.error(new ErrorEvent('network error'));

            service.add(userData[0]);

            req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('update test', () => {
        beforeEach(() => {
            service.add(userData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);
        });

        it('#update - Success', () => {
            const provided = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [updateData],
                    b: null
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#update - Failed with backend error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: userData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#update - Failed with network error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: userData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#update - Success after Failed', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [updateData],
                    b: null
                });

            service.change(updateData);

            let req = httpTestingController.expectOne('http://localhost:3000/users');

            req.error(new ErrorEvent('network error'));

            service.change(updateData);

            req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(userData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);
        });

        it('#delete - Success', () => {
            const provided = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/users/${updateData.id}`);

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#delete - Failed with backend error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: userData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/users/${updateData.id}`);

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Failed with network error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: userData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/users/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Success after Failed', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });

            service.remove(updateData);

            let req = httpTestingController.expectOne(`http://localhost:3000/users/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            service.remove(updateData);

            req = httpTestingController.expectOne(`http://localhost:3000/users/${updateData.id}`);

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('user login test', () => {
        beforeEach(() => {
            service.add(userData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/users');

            req.flush(userData);
        });

        it('#login - Success', () => {
            const provided = service.loggedIn$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: userData[0],
                    b: null
                });

            auth.authenticate(loginData).subscribe((value) => {
                console.log(value);
            });

            const req = httpTestingController.expectOne(`http://localhost:3000/auth/login`);

            req.flush(loginRes);

            expect(service.loggedIn).toEqual(userData[0]);
            expect(provided).toBeObservable(expected);
        });
    });
});
