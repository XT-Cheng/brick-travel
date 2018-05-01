import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { initTest } from '../../../../test';
import { deepExtend } from '../../utils/helpers';
import { ErrorService } from './error.service';
import { TravelAgendaService } from './travelAgenda.service';
import { TravelAgendaUIService } from './travelAgenda.ui.service';

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

const noExist = deepExtend({}, travelAgendaData[0]);
noExist.dailyTrips[0].travelAgenda = noExist;
noExist.dailyTrips[0].travelViewPoints[0].dailyTrip = noExist.dailyTrips[0];
noExist.id = 'noExist';

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

let travelAgendaSrv: TravelAgendaService;
let travelAgendaUISrv: TravelAgendaUIService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('travelAgenda test', () => {
    beforeEach(() => {
        initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        travelAgendaSrv = TestBed.get(TravelAgendaService);
        travelAgendaUISrv = TestBed.get(TravelAgendaUIService);
        errorService = TestBed.get(ErrorService);

        travelAgendaSrv.add(travelAgendaData[0]);
        const req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');
        req.flush(flushData);
    });

    describe('travelAgenda ui test', () => {
        it('#select - Success', () => {
            const provided = travelAgendaSrv.selected$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: travelAgendaData[0],
                    b: null
                });
            travelAgendaUISrv.select(travelAgendaData[0]);
            expect(travelAgendaSrv.selected).toEqual(travelAgendaData[0]);
            expect(provided).toBeObservable(expected);
        });

        it('#select - not exist', () => {
            const provided = travelAgendaSrv.selected$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: null
                });
            travelAgendaUISrv.select(noExist);
            expect(travelAgendaSrv.selected).toEqual(null);
            expect(provided).toBeObservable(expected);
        });

        it('#search - Success', () => {
            const provided = travelAgendaSrv.searched$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: travelAgendaData,
                    b: null
                });
            travelAgendaUISrv.search('黄山');
            expect(travelAgendaUISrv.searchKey).toEqual('黄山');
            expect(provided).toBeObservable(expected);
        });

        it('#search - no exist', () => {
            const provided = travelAgendaSrv.searched$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });
            travelAgendaUISrv.search('noExist');
            expect(travelAgendaUISrv.searchKey).toEqual('noExist');
            expect(provided).toBeObservable(expected);
        });
    });
});
