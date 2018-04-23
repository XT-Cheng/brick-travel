import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { filter } from 'rxjs/operators';

import { FileUploadModule } from '../../fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '../../utils/constants';
import { StoreModule } from '../store.module';
import { CityService } from './city.service';
import { SelectorService } from './selector.service';

let service: CityService;
let selector: SelectorService;
let httpTestingController: HttpTestingController;

describe('1st tests', () => {
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
        service = TestBed.get(CityService);
        selector = TestBed.get(SelectorService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('#getValue should return real value', () => {
        const testData = {
            id: '5a698cc305867f3278211591',
            name: '上海',
            thumbnail: 'assets/img/IMG_4202.jpg'
        };
        service.loadCities();

        const req = httpTestingController.expectOne('http://localhost:3000/cities');

        req.flush(testData);

        selector.cities$.pipe(
            filter(value => value.length > 0)
        ).subscribe(value => {
            expect(value.length).toBeGreaterThan(0);
        });
    });
});

//   describe('ValueService', () => {
//     let service: CityService;
//     beforeEach(() => { service = new CityService(); });

//     it('#getValue should return real value', () => {
//         expect(service.getValue()).toBe('real value');
//     });

//     it('#getObservableValue should return value from observable',
//         (done: DoneFn) => {
//             service.getObservableValue().subscribe(value => {
//                 expect(value).toBe('observable value');
//                 done();
//             });
//         });

//     it('#getPromiseValue should return value from a promise',
//         (done: DoneFn) => {
//             service.getPromiseValue().then(value => {
//                 expect(value).toBe('promise value');
//                 done();
//             });
//         });
// });
