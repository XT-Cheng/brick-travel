import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { FileUploadModule } from '../../fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '../../utils/constants';
import { StoreModule } from '../store.module';
import { CityService } from './city.service';
import { ErrorService } from './error.service';
import { MasterDataService } from './masterData.service';
import { TransportationCategoryService } from './transportationCategory.service';
import { ViewPointService } from './viewPoint.service';
import { initTest } from '../../../../test';

const flushData = {
    viewPointCategories: [
        {
            name: 'View',
            id: '5a4b5756764fba2c80ef5ba1'
        }
    ],
    transportationCategories: [
        {
            name: 'Bus',
            id: '5a4b5756764cca2c80ef5ba1'
        }
    ],
    cities: [
        {
            addressCode: '341000',
            name: '黄山2',
            thumbnail: 'assets/img/alan.png',
            id: '5a4b5756764fba2c80ef5ba1'
        }
    ]
};

const cityData = [
    {
        addressCode: '341000',
        name: '黄山2',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba1'
    }
];

const viewCategoryData = [
    {
        name: 'View',
        id: '5a4b5756764fba2c80ef5ba1'
    }
];

const transportationCategoryData = [
    {
        name: 'Bus',
        id: '5a4b5756764cca2c80ef5ba1'
    }
];

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: MasterDataService;
let viewPointService: ViewPointService;
let transportationCategoryService: TransportationCategoryService;
let errorService: ErrorService;
let cityService: CityService;
let httpTestingController: HttpTestingController;

describe('masterData test', () => {
    beforeEach(() => {
        initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(MasterDataService);
        viewPointService = TestBed.get(ViewPointService);
        transportationCategoryService = TestBed.get(TransportationCategoryService);
        cityService = TestBed.get(CityService);
        errorService = TestBed.get(ErrorService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch - Success', () => {
            const provided = viewPointService.categories$.pipe(
                merge(transportationCategoryService.all$, cityService.all$, errorService.error$)
            );
            const expected = cold('(abcd)',
                {
                    a: viewCategoryData,
                    b: transportationCategoryData,
                    c: cityData,
                    d: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/masterData');

            req.flush(flushData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with backend error', () => {
            const provided = errorService.error$.pipe(
                merge(viewPointService.categories$)
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

            const req = httpTestingController.expectOne('http://localhost:3000/masterData');

            req.flush('error happened', errorData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with network error', () => {
            const provided = errorService.error$.pipe(
                merge(viewPointService.categories$)
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

            const req = httpTestingController.expectOne('http://localhost:3000/masterData');

            req.error(new ErrorEvent('network error'));

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Success after Failed', () => {
            const provided = viewPointService.categories$.pipe(
                merge(transportationCategoryService.all$, cityService.all$, errorService.error$)
            );
            const expected = cold('(abcd)',
                {
                    a: viewCategoryData,
                    b: transportationCategoryData,
                    c: cityData,
                    d: null
                });

            service.fetch();

            let req = httpTestingController.expectOne('http://localhost:3000/masterData');

            req.error(new ErrorEvent('network error'));

            service.fetch();

            req = httpTestingController.expectOne('http://localhost:3000/masterData');

            req.flush(flushData);

            expect(provided).toBeObservable(expected);
        });
    });

});
