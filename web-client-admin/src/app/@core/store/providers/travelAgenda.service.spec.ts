import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { initTest } from '../../../../test';
import { deepExtend } from '../../utils/helpers';
import { ErrorService } from './error.service';
import { TravelAgendaService } from './travelAgenda.service';

const cityData = {
    id: '5a4b5756764fba2c80ef5ba1',
    name: '黄山',
    thumbnail: '',
    addressCode: '100'
};

const categoryData = {
    id: '5acc62fe6c251979dd67f0c1',
    name: 'View'
};

const transportationToNextData = {
    id: '5a4b5756764fbb9c80ef5ba1',
    name: 'Bus',
    isDefault: false
};

const viewPointData = {
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

const travelViewPointsData = [
    {
        transportationToNext: transportationToNextData,
        viewPoint: viewPointData,
        distanceToNext: 100,
        id: '5a85287048294c00009ce922',
        dailyTrip: null
    }
];

const dailyTripsData = [
    {
        travelViewPoints: travelViewPointsData,
        lastViewPoint: '5a4b5756764fba2c878a5ba9',
        id: '5a8523a448294c00009ce921',
        travelAgenda: null
    }
];


const travelAgendaData = [
    {
        name: '黄山',
        user: 'whoiscxt',
        cover: 'assets/img/IMG_4201.jpg',
        dailyTrips: dailyTripsData,
        id: '5a85232348294c00009ce91f'
    }
];

const updateData = deepExtend({}, travelAgendaData[0]);
updateData.dailyTrips[0].travelAgenda = updateData;
updateData.dailyTrips[0].travelViewPoints[0].dailyTrip = updateData.dailyTrips[0];
updateData.name = '黄山1';

dailyTripsData[0].travelAgenda = travelAgendaData[0];
travelViewPointsData[0].dailyTrip = dailyTripsData[0];

const flushData = [
    {
        name: '黄山',
        user: 'whoiscxt',
        cover: 'assets/img/IMG_4201.jpg',
        dailyTrips: [
            {
                travelViewPoints: [
                    {
                        transportationToNext: transportationToNextData,
                        viewPoint: viewPointData,
                        distanceToNext: 100,
                        id: '5a85287048294c00009ce922',
                        dailyTrip: '5a8523a448294c00009ce921'
                    }
                ],
                lastViewPoint: '5a4b5756764fba2c878a5ba9',
                id: '5a8523a448294c00009ce921',
                travelAgenda: '5a85232348294c00009ce91f'
            }
        ],
        id: '5a85232348294c00009ce91f'
    }
];

const flushDataWithUpdate = [
    {
        name: '黄山1',
        user: 'whoiscxt',
        cover: 'assets/img/IMG_4201.jpg',
        dailyTrips: [
            {
                travelViewPoints: [
                    {
                        transportationToNext: transportationToNextData,
                        viewPoint: viewPointData,
                        distanceToNext: 100,
                        id: '5a85287048294c00009ce922',
                        dailyTrip: '5a8523a448294c00009ce921'
                    }
                ],
                lastViewPoint: '5a4b5756764fba2c878a5ba9',
                id: '5a8523a448294c00009ce921',
                travelAgenda: '5a85232348294c00009ce91f'
            }
        ],
        id: '5a85232348294c00009ce91f'
    }
];

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: TravelAgendaService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('travelAgenda test', () => {
    beforeEach(() => {
        initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(TravelAgendaService);
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
                    a: travelAgendaData,
                    b: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushData);

            expect(provided).toBeObservable(expected);
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
            const provided = errorService.error$.pipe(
                merge(service.all$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: travelAgendaData
                });

            service.fetch();

            let req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.error(new ErrorEvent('network error'));

            service.fetch();

            req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushData);

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
                    a: travelAgendaData,
                    b: null
                });

            service.add(travelAgendaData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushData);

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

            service.add(travelAgendaData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

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

            service.add(travelAgendaData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#add - Success after Failed', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: travelAgendaData,
                    b: null
                });

            service.add(travelAgendaData[0]);

            let req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.error(new ErrorEvent('network error'));

            service.add(travelAgendaData[0]);

            req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushData);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('update test', () => {
        beforeEach(() => {
            service.add(travelAgendaData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushData);
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

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushDataWithUpdate);

            expect(provided).toBeObservable(expected);
        });

        it('#update - Failed with backend error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: travelAgendaData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#update - Failed with network error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: travelAgendaData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

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

            let req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.error(new ErrorEvent('network error'));

            service.change(updateData);

            req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushDataWithUpdate);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(travelAgendaData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');

            req.flush(flushData);
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

            const req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

            req.flush(flushData);

            expect(provided).toBeObservable(expected);
        });

        it('#delete - Failed with backend error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: travelAgendaData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Failed with network error', () => {
            const provide = service.all$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: travelAgendaData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

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

            let req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            service.remove(updateData);

            req = httpTestingController.expectOne(`http://localhost:3000/travelAgendas/${updateData.id}`);

            req.flush(flushData);

            expect(provide).toBeObservable(expected);
        });
    });
});
