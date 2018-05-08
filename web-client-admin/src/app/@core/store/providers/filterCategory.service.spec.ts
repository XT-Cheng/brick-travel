import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { IError } from '../store.model';
import { ErrorService } from './error.service';
import { FilterCategoryService } from './filterCategory.service';

const filterCategoryData = {
    name: '类型',
    filterFunction: 'filterByCategory',
    criteries: [
        {
            name: '景点',
            criteria: '0',
            isChecked: false,
            id: '5a4b4d6030e1cf2b19b493da'
        },
        {
            name: '美食',
            criteria: '1',
            isChecked: false,
            id: '5a4b4d6030e1cf2b19b493d9'
        }
    ],
    id: '5a4b4d6030e1cf2b19b493d8'
};

const changeData = Object.assign({}, filterCategoryData, {
    name: '类型1'
});

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

let service: FilterCategoryService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let result;
let error;

fdescribe('filterCategory test', () => {
    beforeEach(() => {
        initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(FilterCategoryService);
        errorService = TestBed.get(ErrorService);

        errorService.error$.subscribe((value) => {
            error = value;
        });
        service.all$.subscribe((value) => {
            result = value;
        });
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch()', () => {
            service.fetch();
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.flush([filterCategoryData]);

            expect(result).toEqual([filterCategoryData]);
            expect(error).toEqual(null);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.flush([filterCategoryData]);

            expect(service.byId(filterCategoryData.id)).toEqual(filterCategoryData);
        });
        it('#fetch() with backend error', () => {
            service.fetch();
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error).toEqual(backendError);
        });

        it('#fetch() with network error', () => {
            service.fetch();
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error).toEqual(networkError);
        });
    });

    describe('add test', () => {
        it('#add()', () => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.flush([filterCategoryData]);

            expect(service.byId(filterCategoryData.id)).toEqual(filterCategoryData);
        });

        it('#add() with backend error', () => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error).toEqual(backendError);
        });

        it('#add() with network error', () => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error).toEqual(networkError);
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush([filterCategoryData]);
        });

        it('#change()', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.flush([changeData]);

            expect(result).toEqual([changeData]);
            expect(error).toEqual(null);
        });

        it('#change() with backend error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.flush('error happened', errorData);

            expect(result).toEqual([filterCategoryData]);
            expect(error).toEqual(backendError);
        });

        it('#change() with network error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([filterCategoryData]);
            expect(error).toEqual(networkError);
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne('http://localhost:3000/filterCategories');

            req.flush([filterCategoryData]);
        });

        it('#delete()', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${changeData.id}`);
            req.flush([changeData]);

            expect(result).toEqual([]);
            expect(error).toEqual(null);
        });

        it('#delete() with backend error', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${changeData.id}`);
            req.flush('error happened', errorData);

            expect(result).toEqual([filterCategoryData]);
            expect(error).toEqual(backendError);
        });

        it('#delete() with network error', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`http://localhost:3000/filterCategories/${changeData.id}`);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([filterCategoryData]);
            expect(error).toEqual(networkError);
        });
    });
});
