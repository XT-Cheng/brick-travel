import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { FileUploadModule } from '../../fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '../../utils/constants';
import { StoreModule } from '../store.module';
import { ErrorService } from './error.service';
import { MasterDataService } from './masterData.service';
import { ViewPointService } from './viewPoint.service';

const flushData = {
    viewPointCategories: [
        {
            name: 'View',
            id: '5a4b5756764fba2c80ef5ba1'
        }
    ]
};

const masterData = [
    {
        name: 'View',
        id: '5a4b5756764fba2c80ef5ba1'
    }
];

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: MasterDataService;
let viewPointService: ViewPointService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('masterData test', () => {
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
        service = TestBed.get(MasterDataService);
        viewPointService = TestBed.get(ViewPointService);
        errorService = TestBed.get(ErrorService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch - Success', () => {
            const provided = viewPointService.viewPointCategories$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: masterData,
                    b: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/masterData');

            req.flush(flushData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with backend error', () => {
            const provided = errorService.error$.pipe(
                merge(viewPointService.viewPointCategories$)
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
                merge(viewPointService.viewPointCategories$)
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
            const provided = errorService.error$.pipe(
                merge(viewPointService.viewPointCategories$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: masterData
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
