import { NextFunction, Request, Response, Router } from 'express';

import { ViewPointModel } from '../data-model/viewPoint.model';
import { asyncMiddleware } from '../utils/utility';
import { FilterCategoryModel } from '../data-model/filterCateogry.model';

export class FilterCategoryRoute {
    public static create(router: Router) {
        console.log('FilterCategory route create');

        //Load Filter Categories
        router.get('/filterCategories', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await FilterCategoryRoute.load(req, res, next);
        }));
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await FilterCategoryModel.findFilterCategories();
        res.json(ret);
    }
}