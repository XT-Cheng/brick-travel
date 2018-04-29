import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { cold } from 'jasmine-marbles';
import { merge } from 'rxjs/operators';

import { FileUploadModule } from '../../fileUpload/fileUpload.module';
import { WEBAPI_HOST } from '../../utils/constants';
import { StoreModule } from '../store.module';
import { ErrorService } from './error.service';
import { ViewPointService } from './viewPoint.service';
import { ViewPointUIService } from './viewPoint.ui.service';
import { initTest } from '../../../../test';

const noExist = {
    city: null,
    updatedAt: '2017-12-31T16:41:34.724Z',
    createdAt: '2017-12-31T16:37:36.733Z',
    name: '老街',
    category: null,
    tags: [],
    description: '朱家角',
    tips: '老大桥测试OK，完全好玩不过但是。',
    timeNeeded: '1-2小时',
    address: '黄山中路888号',
    latitude: 29.8,
    longtitude: 118.3,
    rank: 4.5,
    thumbnail: 'assets/img/IMG_4201.jpg',
    comments: [],
    countOfComments: 11,
    images: [],
    id: '5a4912502350c4065c30f6aa'
};

const viewPointData = [
    {
        city: {
            addressCode: '341000',
            name: '黄山2',
            thumbnail: 'assets/img/alan.png',
            id: '5a4b5756764fba2c80ef5ba1'
        },
        updatedAt: '2017-12-31T16:41:34.724Z',
        createdAt: '2017-12-31T16:37:36.733Z',
        name: '老街',
        category: {
            id: '5acc62fe6c251979dd67f0c1',
            name: '景点'
        },
        tags: [
            '人文'
        ],
        description: '朱家角',
        tips: '老大桥测试OK，完全好玩不过但是。',
        timeNeeded: '1-2小时',
        address: '黄山中路888号',
        latitude: 29.8,
        longtitude: 118.3,
        rank: 4.5,
        thumbnail: 'assets/img/IMG_4201.jpg',
        comments: [
            {
                detail: '朱家角镇',
                user: 'Xiaotian',
                avatar: 'assets/img/IMG_4203.jpg',
                rate: 3.5,
                images: [
                    'assets/img/IMG_4203.jpg',
                    'assets/img/IMG_4204.jpg'
                ],
                publishedAt: new Date('2017-12-31T16:37:36.718Z'),
                id: 'aaa912502350c4065c30f6ae'
            }
        ],
        countOfComments: 11,
        images: [
            'assets/img/IMG_4203.jpg',
            'assets/img/IMG_4204.jpg',
            'assets/img/IMG_4203.jpg',
            'assets/img/IMG_4204.jpg'
        ],
        id: '5a4912502350c4065c30f6ad'
    }
];

let viewPointSrv: ViewPointService;
let viewPointUISrv: ViewPointUIService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

describe('viewPoint test', () => {
    beforeEach(() => {
        initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        viewPointSrv = TestBed.get(ViewPointService);
        viewPointUISrv = TestBed.get(ViewPointUIService);
        errorService = TestBed.get(ErrorService);

        viewPointSrv.add(viewPointData[0]);
        const req = httpTestingController.expectOne('http://localhost:3000/viewPoints');
        req.flush(viewPointData);
    });

    describe('viewPoint ui test', () => {
        it('#select - Success', () => {
            const provided = viewPointSrv.selected$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: viewPointData[0],
                    b: null
                });
            viewPointUISrv.select(viewPointData[0]);
            expect(viewPointSrv.selected).toEqual(viewPointData[0]);
            expect(provided).toBeObservable(expected);
        });

        it('#select - not exist', () => {
            const provided = viewPointSrv.selected$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: null,
                    b: null
                });
            viewPointUISrv.select(noExist);
            expect(viewPointSrv.selected).toEqual(null);
            expect(provided).toBeObservable(expected);
        });

        it('#search - Success', () => {
            const provided = viewPointSrv.searched$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: viewPointData,
                    b: null
                });
            viewPointUISrv.search('老街');
            expect(viewPointUISrv.searchKey).toEqual('老街');
            expect(provided).toBeObservable(expected);
        });

        it('#search - no exist', () => {
            const provided = viewPointSrv.searched$.pipe(
                merge(errorService.error$)
            );
            const expected = cold('(ab)',
                {
                    a: [],
                    b: null
                });
            viewPointUISrv.search('noExist');
            expect(viewPointUISrv.searchKey).toEqual('noExist');
            expect(provided).toBeObservable(expected);
        });
    });
});
