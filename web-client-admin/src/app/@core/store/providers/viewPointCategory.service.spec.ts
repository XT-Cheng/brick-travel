import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { FileUploadModule } from '../../fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '../../utils/constants';
import { StoreModule } from '../store.module';
import { ErrorService } from './error.service';
import { ViewPointCategoryService } from './viewPointCategory.service';

const viewPointCategoryData = [
    {
        name: 'View',
        id: '5a4b5756764fba2c80ef5ba1'
    }
];

const updateData = {
    name: 'Hotel',
    id: '5a4b5756764fba2c80ef5ba1'
};

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: ViewPointCategoryService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('viwePoint Category test', () => {
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
        service = TestBed.get(ViewPointCategoryService);
        errorService = TestBed.get(ErrorService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch - Success', () => {
            const provided = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: viewPointCategoryData,
                    b: null
                });
            service.fetch();

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush(viewPointCategoryData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with backend error', () => {
            const provided = errorService.error$.pipe(
                merge(service.viewPointCategories$)
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

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush('error happened', errorData);

            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Failed with network error', () => {
            const provided = errorService.error$.pipe(
                merge(service.viewPointCategories$)
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

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.error(new ErrorEvent('network error'));


            expect(provided).toBeObservable(expected);
        });

        it('#fetch - Success after Failed', () => {
            const provided = errorService.error$.pipe(
                merge(service.viewPointCategories$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: viewPointCategoryData
                });

            service.fetch();

            let req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.error(new ErrorEvent('network error'));

            service.fetch();

            req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush(viewPointCategoryData);

            expect(provided).toBeObservable(expected);
        });
    });

    describe('add test', () => {
        it('#add - Success', () => {
            const provided = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointCategoryData,
                    b: null
                });

            service.add(viewPointCategoryData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush(viewPointCategoryData);

            expect(provided).toBeObservable(expected);
        });

        it('#add - Failed with backend error', () => {
            const provide = service.viewPointCategories$.pipe(
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

            service.add(viewPointCategoryData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#add - Failed with network error', () => {
            const provide = service.viewPointCategories$.pipe(
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

            service.add(viewPointCategoryData[0]);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#add - Success after Failed', () => {
            const provide = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointCategoryData,
                    b: null
                });

            service.add(viewPointCategoryData[0]);

            let req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.error(new ErrorEvent('network error'));

            service.add(viewPointCategoryData[0]);

            req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush(viewPointCategoryData);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('update test', () => {
        beforeEach(() => {
            service.add(viewPointCategoryData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush(viewPointCategoryData);
        });

        it('#update - Success', () => {
            const provided = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [updateData],
                    b: null
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#update - Failed with backend error', () => {
            const provide = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointCategoryData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#update - Failed with network error', () => {
            const provide = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointCategoryData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.change(updateData);

            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#update - Success after Failed', () => {
            const provide = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [updateData],
                    b: null
                });

            service.change(updateData);

            let req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.error(new ErrorEvent('network error'));

            service.change(updateData);

            req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(viewPointCategoryData[0]);
            const req = httpTestingController.expectOne('http://localhost:3000/viewPointCategories');

            req.flush(viewPointCategoryData);
        });

        it('#delete - Success', () => {
            const provided = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/viewPointCategories/${updateData.id}`);

            req.flush([updateData]);

            expect(provided).toBeObservable(expected);
        });

        it('#delete - Failed with backend error', () => {
            const provide = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointCategoryData,
                    b: {
                        network: false,
                        description: 'error happened',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/viewPointCategories/${updateData.id}`);

            req.flush('error happened', errorData);

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Failed with network error', () => {
            const provide = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: viewPointCategoryData,
                    b: {
                        network: true,
                        description: '',
                        stack: ''
                    }
                });

            service.remove(updateData);

            const req = httpTestingController.expectOne(`http://localhost:3000/viewPointCategories/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            expect(provide).toBeObservable(expected);
        });

        it('#delete - Success after Failed', () => {
            const provide = service.viewPointCategories$.pipe(
                merge(errorService.error$)
            );

            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });

            service.remove(updateData);

            let req = httpTestingController.expectOne(`http://localhost:3000/viewPointCategories/${updateData.id}`);

            req.error(new ErrorEvent('network error'));

            service.remove(updateData);

            req = httpTestingController.expectOne(`http://localhost:3000/viewPointCategories/${updateData.id}`);

            req.flush([updateData]);

            expect(provide).toBeObservable(expected);
        });
    });
});
