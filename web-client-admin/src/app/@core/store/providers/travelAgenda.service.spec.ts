import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { initTest } from '../../../../test';
import { viewPoint } from '../../store.v0/entity/entity.schema';
import { ICityBiz } from '../bizModel/model/city.biz.model';
import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz, IViewPointCategoryBiz } from '../bizModel/model/viewPoint.biz.model';
import { ITransportationCategory } from '../entity/model/travelAgenda.model';
import { ErrorService } from './error.service';
import { TransportationCategoryService } from './transportationCategory.service';
import { TravelAgendaService } from './travelAgenda.service';

const transportationData: ITransportationCategory = {
    id: 'transportationCategoryId',
    name: 'Bus',
    isDefault: true
};

const cityData: ICityBiz = {
    id: '5a4b5756764fba2c80ef5ba1',
    name: '黄山',
    thumbnail: '',
    addressCode: '100'
};

const categoryData: IViewPointCategoryBiz = {
    id: '5acc62fe6c251979dd67f0c1',
    name: 'View'
};

const viewPointData: IViewPointBiz = {
    city: cityData,
    name: '老大桥9',
    category: categoryData,
    tags: [],
    description: '朱家角',
    tips: '老大桥测试OK',
    timeNeeded: '1-2小时',
    address: '黄山中路888号',
    latitude: 29.813,
    longtitude: 118.22,
    rank: 5,
    thumbnail: 'assets/img/IMG_4201.jpg',
    comments: [],
    countOfComments: 0,
    images: [
        'assets/img/IMG_4203.jpg',
        'assets/img/IMG_4204.jpg'
    ],
    id: '5a4b5756764fba2c878a5ba9'
};

const travelAgendaData: ITravelAgendaBiz = {
    id: '5a4b5756764fb8u7c78a5ba9',
    name: '黄山',
    user: 'whoiscxt',
    cover: 'assets/img/IMG_4201.jpg',
    dailyTrips: []
};

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: TravelAgendaService;
let transportationService: TransportationCategoryService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;
let AMap: any;

describe('travelAgenda test', () => {
    beforeEach(() => {
        initTest();

        AMap = {
            LngLat: function (longtitude: number, latitude: number) { }
        };

        AMap.LngLat.prototype.distance = function () {
            return Math.floor(Math.random() * 1000) + 1000;
        };

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(TravelAgendaService);
        errorService = TestBed.get(ErrorService);
        transportationService = TestBed.get(TransportationCategoryService);

        transportationService.fetch();

        const req = httpTestingController.expectOne('http://localhost:3000/transportationCategories');

        req.flush([transportationData]);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch - Success', () => {

            const flushData = Object.assign({}, travelAgendaData);

            const provided = service.all$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: [travelAgendaData],
                    b: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush([flushData]);

            expect(provided).toBeObservable(expected);
        });
        it('#byId - Success', () => {
            const flushData = Object.assign({}, travelAgendaData);

            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush([flushData]);

            expect(service.byId(travelAgendaData.id)).toEqual(travelAgendaData);
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

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

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

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.error(new ErrorEvent('network error'));

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Success after Failed', () => {
            const flushData = Object.assign({}, travelAgendaData);
            const provided = errorService.error$.pipe(
                merge(service.all$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: [travelAgendaData]
                });

            service.fetch();

            let req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.error(new ErrorEvent('network error'));

            service.fetch();

            req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush([flushData]);

            expect(provided).toBeObservable(expected);
        });
    });

    describe('add test', () => {
        fit('#add - Success', () => {
            const dailyTripData: IDailyTripBiz = {
                travelViewPoints: [],
                travelAgenda: null,
                lastViewPoint: null,
                id: 'dailyTripId'
            };
            const travelViewPointData: ITravelViewPointBiz = {
                distanceToNext: -1,
                dailyTrip: null,
                transportationToNext: null,
                viewPoint: viewPointData,
                id: 'travelViewPointId'
            };

            const flushData = Object.assign({}, travelAgendaData);
            const provided = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [travelAgendaData],
                    b: null
                });

            // 1. Add empty TravelAgenda
            service.add(travelAgendaData);

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush([flushData]);

            // 2. Add empty Daily Trip
            service.addDailyTrip(dailyTripData, travelAgendaData.id);

            // 3. Add TravelViewPoint
            service.addTravelViewPoint(travelViewPointData, dailyTripData.id);

            expect(provided).toBeObservable(expected);
        });

        // it('#add dailyTrip - Success', () => {
        //     const provided = service.all$.pipe(
        //         map(values => values[0].id),
        //         merge(errorService.error$)
        //     );

        //     const expected = cold('(ab)',
        //         {
        //             a: '5a4b5756764fb8u7c78a5ba9',
        //             b: null
        //         });

        //     service.add(travelAgendaData);

        //     const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

        //     req.flush(flushData);

        //     service.addDailyTrip(travelAgendaData);

        //     expect(provided).toBeObservable(expected);
        // });

        // it('#add viewPoint - Success', () => {
        //     const provided = service.all$.pipe(
        //         map(values => values[0].dailyTrips[0].travelViewPoints.length),
        //         merge(errorService.error$)
        //     );

        //     const expected = cold('(ab)',
        //         {
        //             a: 1,
        //             b: null
        //         });

        //     service.add(travelAgendaData);

        //     const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

        //     req.flush(flushData);

        //     service.addDailyTrip(travelAgendaData);
        //     service.addTravelViewPoint(viewPointData, travelAgendaData.dailyTrips[0]);

        //     expect(provided).toBeObservable(expected);
        // });

        // it('#add - Failed with backend error', () => {
        //     const provide = service.all$.pipe(
        //         merge(errorService.error$)
        //     );

        //     const expected = cold('(ab)',
        //         {
        //             a: [],
        //             b: {
        //                 network: false,
        //                 description: 'error happened',
        //                 stack: ''
        //             }
        //         });

        //     service.add(travelAgendaData[0]);

        //     const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

        //     req.flush('error happened', errorData);

        //     expect(provide).toBeObservable(expected);
        // });

        // it('#add - Failed with network error', () => {
        //     const provide = service.all$.pipe(
        //         merge(errorService.error$)
        //     );

        //     const expected = cold('(ab)',
        //         {
        //             a: [],
        //             b: {
        //                 network: true,
        //                 description: '',
        //                 stack: ''
        //             }
        //         });

        //     service.add(travelAgendaData[0]);

        //     const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

        //     req.error(new ErrorEvent('network error'));

        //     expect(provide).toBeObservable(expected);
        // });

        // it('#add - Success after Failed', () => {
        //     const provide = service.all$.pipe(
        //         merge(errorService.error$)
        //     );

        //     const expected = cold('(ab)',
        //         {
        //             a: travelAgendaData,
        //             b: null
        //         });

        //     service.add(travelAgendaData[0]);

        //     let req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

        //     req.error(new ErrorEvent('network error'));

        //     service.add(travelAgendaData[0]);

        //     req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

        //     req.flush(flushData);

        //     expect(provide).toBeObservable(expected);
        // });
    });

    // describe('update test', () => {
    //     beforeEach(() => {
    //         service.add(travelAgendaData[0]);
    //         const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

    //         req.flush(flushData);
    //     });

    //     it('#update - Success', () => {
    //         const provided = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: [updateData],
    //                 b: null
    //             });

    //         service.change(updateData);

    //         const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

    //         req.flush(flushDataWithUpdate);

    //         expect(provided).toBeObservable(expected);
    //     });

    //     it('#update - Failed with backend error', () => {
    //         const provide = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: travelAgendaData,
    //                 b: {
    //                     network: false,
    //                     description: 'error happened',
    //                     stack: ''
    //                 }
    //             });

    //         service.change(updateData);

    //         const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

    //         req.flush('error happened', errorData);

    //         expect(provide).toBeObservable(expected);
    //     });

    //     it('#update - Failed with network error', () => {
    //         const provide = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: travelAgendaData,
    //                 b: {
    //                     network: true,
    //                     description: '',
    //                     stack: ''
    //                 }
    //             });

    //         service.change(updateData);

    //         const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

    //         req.error(new ErrorEvent('network error'));

    //         expect(provide).toBeObservable(expected);
    //     });

    //     it('#update - Success after Failed', () => {
    //         const provide = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: [updateData],
    //                 b: null
    //             });

    //         service.change(updateData);

    //         let req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

    //         req.error(new ErrorEvent('network error'));

    //         service.change(updateData);

    //         req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

    //         req.flush(flushDataWithUpdate);

    //         expect(provide).toBeObservable(expected);
    //     });
    // });

    // describe('delete test', () => {
    //     beforeEach(() => {
    //         service.add(travelAgendaData[0]);
    //         const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

    //         req.flush(flushData);
    //     });

    //     it('#delete - Success', () => {
    //         const provided = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: [],
    //                 b: null
    //             });

    //         service.remove(updateData);

    //         const req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

    //         req.flush(flushData);

    //         expect(provided).toBeObservable(expected);
    //     });

    //     it('#delete - Failed with backend error', () => {
    //         const provide = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: travelAgendaData,
    //                 b: {
    //                     network: false,
    //                     description: 'error happened',
    //                     stack: ''
    //                 }
    //             });

    //         service.remove(updateData);

    //         const req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

    //         req.flush('error happened', errorData);

    //         expect(provide).toBeObservable(expected);
    //     });

    //     it('#delete - Failed with network error', () => {
    //         const provide = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: travelAgendaData,
    //                 b: {
    //                     network: true,
    //                     description: '',
    //                     stack: ''
    //                 }
    //             });

    //         service.remove(updateData);

    //         const req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

    //         req.error(new ErrorEvent('network error'));

    //         expect(provide).toBeObservable(expected);
    //     });

    //     it('#delete - Success after Failed', () => {
    //         const provide = service.all$.pipe(
    //             merge(errorService.error$)
    //         );

    //         const expected = cold('(ab)',
    //             {
    //                 a: [],
    //                 b: null
    //             });

    //         service.remove(updateData);

    //         let req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

    //         req.error(new ErrorEvent('network error'));

    //         service.remove(updateData);

    //         req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

    //         req.flush(flushData);

    //         expect(provide).toBeObservable(expected);
    //     });
    // });
});
