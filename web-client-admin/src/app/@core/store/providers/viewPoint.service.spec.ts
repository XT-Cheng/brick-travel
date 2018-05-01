import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { initTest } from '../../../../test';
import { ErrorService } from './error.service';
import { ViewPointService } from './viewPoint.service';

const viewPointData = [
    {
        city: {
            addressCode: '341000',
            name: '黄山2',
            thumbnail: 'assets/img/alan.png',
            id: '5a4b5756764fba2c80ef5ba1'
        },
        updatedAt: '2017-12-31T16:41:34.724Z',
        createdAt: '2017-12-31T16:37:36.733Z',
        name: '老街',
        category: {
            id: '5acc62fe6c251979dd67f0c1',
            name: '景点'
        },
        tags: [
            '人文'
        ],
        description: '朱家角',
        tips: '老大桥测试OK，完全好玩不过但是。',
        timeNeeded: '1-2小时',
        address: '黄山中路888号',
        latitude: 29.8,
        longtitude: 118.3,
        rank: 4.5,
        thumbnail: 'assets/img/IMG_4201.jpg',
        comments: [
            {
                detail: '朱家角镇',
                user: 'Xiaotian',
                avatar: 'assets/img/IMG_4203.jpg',
                rate: 3.5,
                images: [
                    'assets/img/IMG_4203.jpg',
                    'assets/img/IMG_4204.jpg'
                ],
                publishedAt: new Date('2017-12-31T16:37:36.718Z'),
                id: 'aaa912502350c4065c30f6ae'
            }
        ],
        countOfComments: 11,
        images: [
            'assets/img/IMG_4203.jpg',
            'assets/img/IMG_4204.jpg',
            'assets/img/IMG_4203.jpg',
            'assets/img/IMG_4204.jpg'
        ],
        id: '5a4912502350c4065c30f6ad'
    }
];

const updateData = {
    city: {
        addressCode: '341000',
        name: '黄山2',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba1'
    },
    updatedAt: '2017-12-31T16:41:34.724Z',
    createdAt: '2017-12-31T16:37:36.733Z',
    name: '老街123',
    category: {
        id: '5acc62fe6c251979dd67f0c1',
        name: '景点'
    },
    tags: [
        '人文'
    ],
    description: '朱家角',
    tips: '老大桥测试OK，完全好玩不过但是。',
    timeNeeded: '1-2小时',
    address: '黄山中路888号',
    latitude: 29.8,
    longtitude: 118.3,
    rank: 4.5,
    thumbnail: 'assets/img/IMG_4201.jpg',
    comments: [
        {
            detail: '朱家角镇',
            user: 'Xiaotian',
            avatar: 'assets/img/IMG_4203.jpg',
            rate: 3.5,
            images: [
                'assets/img/IMG_4203.jpg',
                'assets/img/IMG_4204.jpg'
            ],
            publishedAt: new Date('2017-12-31T16:37:36.718Z'),
            id: 'aaa912502350c4065c30f6ae'
        }
    ],
    countOfComments: 11,
    images: [
        'assets/img/IMG_4203.jpg',
        'assets/img/IMG_4204.jpg',
        'assets/img/IMG_4203.jpg',
        'assets/img/IMG_4204.jpg'
    ],
    id: '5a4912502350c4065c30f6ad'
};

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: ViewPointService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('viewPoint test', () => {
    beforeEach(() => {
        initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(ViewPointService);
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
                    a: viewPointData,
                    b: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush(viewPointData);

            expect(provided).toBeObservable(expected);
        });
        it('#byId - Success', () => {
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush(viewPointData);

            expect(service.byId(viewPointData[0].id)).toEqual(viewPointData[0]);
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

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

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

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

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
                    b: viewPointData
                });

            service.fetch();

            let req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.error(new ErrorEvent('network error'));

            service.fetch();

            req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush(viewPointData);

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
                    a: viewPointData,
                    b: null
                });

            service.add(viewPointData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush(viewPointData);

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

            service.add(viewPointData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

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

            service.add(viewPointData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#add - Success after Failed', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointData,
                    b: null
                });

            service.add(viewPointData[0]);

            let req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.error(new ErrorEvent('network error'));

            service.add(viewPointData[0]);

            req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush(viewPointData);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('update test', () => {
        beforeEach(() => {
            service.add(viewPointData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush(viewPointData);
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

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#update - Failed with backend error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#update - Failed with network error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

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

            let req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.error(new ErrorEvent('network error'));

            service.change(updateData);

            req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(viewPointData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');

            req.flush(viewPointData);
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

            const req = httpTestingController.expectOne(`http://localhost:3000/viewPoints/${updateData.id}`);

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#delete - Failed with backend error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/viewPoints/${updateData.id}`);

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Failed with network error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/viewPoints/${updateData.id}`);

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

            let req = httpTestingController.expectOne(`http://localhost:3000/viewPoints/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            service.remove(updateData);

            req = httpTestingController.expectOne(`http://localhost:3000/viewPoints/${updateData.id}`);

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });
});
