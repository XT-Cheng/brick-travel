import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { ICityBiz } from '../bizModel/model/city.biz.model';
import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz, IViewPointCategoryBiz } from '../bizModel/model/viewPoint.biz.model';
import { ITransportationCategory } from '../entity/model/travelAgenda.model';
import { IError } from '../store.model';
import { ErrorService } from './error.service';
import { TransportationCategoryService } from './transportationCategory.service';
import { TravelAgendaService } from './travelAgenda.service';
import { ViewPointService } from './viewPoint.service';

const url = 'http://localhost:3000/travelAgendas';

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

const travelViewPointData: ITravelViewPointBiz = {
    id: '5a4b5756764fba2c878accc9',
    distanceToNext: 100,
    transportationToNext: null,
    viewPoint: viewPointData,
    dailyTrip: null
};

const dailyTripData: IDailyTripBiz = {
    id: '5a4b5756764fba2c87dddba9',
    travelViewPoints: [travelViewPointData],
    lastViewPoint: travelViewPointData,
    travelAgenda: null
};

const travelAgendaData: ITravelAgendaBiz = {
    id: '5a4b5756764fb8u7c78a5ba9',
    name: '黄山',
    user: 'whoiscxt',
    cover: 'assets/img/IMG_4201.jpg',
    dailyTrips: [dailyTripData]
};

travelViewPointData.dailyTrip = dailyTripData;
dailyTripData.travelAgenda = travelAgendaData;

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

const backendError: IError = {
    network: false,
    description: 'error happened',
    stack: ''
};

const networkError: IError = {
    network: true,
    description: '',
    stack: ''
};

let service: TravelAgendaService;
let transportationService: TransportationCategoryService;
let viewPointService: ViewPointService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;
let AMap: any;

let result;
let error;

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
        viewPointService = TestBed.get(ViewPointService);

        errorService.error$.subscribe((value) => {
            error = value;
        });
        service.all$.subscribe((value) => {
            result = value;
        });

        transportationService.fetch();
        let req = httpTestingController.expectOne('http://localhost:3000/transportationCategories');
        req.flush([transportationData]);

        viewPointService.fetch();
        req = httpTestingController.expectOne('http://localhost:3000/viewPoints');
        req.flush([viewPointData]);

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([service.toTransfer(travelAgendaData)]);

            expect(result).toEqual([travelAgendaData]);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([service.toTransfer(travelAgendaData)]);

            expect(service.byId(travelAgendaData.id)).toEqual(travelAgendaData);
        });
        it('#fetch() with backend error', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error).toEqual(backendError);
        });
        it('#fetch() with network error', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error).toEqual(networkError);
        });
    });

    describe('add test', () => {
        it('#add()', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            service.add(addedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.flush([service.toTransfer(addedTravelAgenda)]);

            expect(result).toEqual([addedTravelAgenda]);

            // 2. Add empty Daily Trip
            service.addDailyTrip(addedTravelAgenda.id);
            expect(result[0].dailyTrips.length).toEqual(1);
            let dailyTrip = result[0].dailyTrips[0];
            expect(dailyTrip.travelAgenda.id).toEqual(addedTravelAgenda.id);

            // 3. Add TravelViewPoint
            service.addTravelViewPoint(viewPointData, dailyTrip.id);
            dailyTrip = result[0].dailyTrips[0];
            expect(dailyTrip.travelViewPoints.length).toEqual(1);
            expect(dailyTrip.travelViewPoints[0].viewPoint.name).toEqual('老大桥9');
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(travelAgendaData);
            const req = httpTestingController.expectOne(url);

            req.flush([service.toTransfer(travelAgendaData)]);
        });

        it('#change()', () => {
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.flush([service.toTransfer(changedTravelAgenda)]);

            expect(result[0].name).toEqual('黄山1');
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(travelAgendaData);
            const req = httpTestingController.expectOne(url);

            req.flush([service.toTransfer(travelAgendaData)]);
        });

        it('#delete()', () => {
            service.remove(travelAgendaData);
            const req = httpTestingController.expectOne(`${url}/${travelAgendaData.id}`);
            req.flush([service.toTransfer(travelAgendaData)]);

            expect(result).toEqual([]);
        });
    });
});
