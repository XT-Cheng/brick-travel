import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { FileUploadModule } from '../../fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '../../utils/constants';
import { StoreModule } from '../store.module';
import { CityService } from './city.service';
import { CityUIService } from './city.ui.service';
import { ErrorService } from './error.service';

const noExist = {
    addressCode: '341000',
    name: '黄山1',
    thumbnail: 'assets/img/alan.png',
    id: 'noExist'
};

const cityData = [
    {
        addressCode: '341000',
        name: '黄山1',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba1'
    },
    {
        addressCode: '341000',
        name: '黄山2',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba2'
    },
    {
        addressCode: '341000',
        name: '黄山3',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba3'
    },
    {
        addressCode: '341000',
        name: '黄山4',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba4'
    },
    {
        addressCode: '341000',
        name: 'Search',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba5'
    }
];

let prepare: CityService;
let service: CityUIService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('city test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                IonicStorageModule.forRoot(),
                StoreModule.forRoot(),
                FileUploadModule.forRoot({ url: `${WEBAPI_HOST}/fileUpload` })
            ]
        });
        httpTestingController = TestBed.get(HttpTestingController);
        prepare = TestBed.get(CityService);
        service = TestBed.get(CityUIService);
        errorService = TestBed.get(ErrorService);

        prepare.add(cityData[0]);
        const req = httpTestingController.expectOne('http://localhost:3000/cities');
        req.flush(cityData);
    });

    describe('city ui test', () => {
        it('#select - Success', () => {
            const provided = service.selectedCity$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: cityData[0],
                    b: null
                });
            service.selectCity(cityData[0]);
            expect(service.selectedCity).toEqual(cityData[0]);
            expect(provided).toBeObservable(expected);
        });

        it('#select - not exist', () => {
            const provided = service.selectedCity$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: null
                });
            service.selectCity(noExist);
            expect(service.selectedCity).toEqual(null);
            expect(provided).toBeObservable(expected);
        });

        it('#search - Success', () => {
            const provided = service.searchedCities$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: [cityData[4]],
                    b: null
                });
            service.searchCity('Search');
            expect(service.searchKey).toEqual('Search');
            expect(provided).toBeObservable(expected);
        });

        it('#search - no exist', () => {
            const provided = service.searchedCities$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });
            service.searchCity('noExist');
            expect(service.searchKey).toEqual('noExist');
            expect(provided).toBeObservable(expected);
        });
    });
});
