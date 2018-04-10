import { NextFunction, Request, Response, Router } from 'express';

import { asyncMiddleware } from '../utils/utility';
import { ViewPointCategoryModel } from '../data-model/viewPointCategory.model';
import { TransportationCategory } from '../data-model/travelAgenda.model';
import { TransportationCategoryModel } from '../data-model/transportationCategory.model';

export class MasterDataRoute {
    public static create(router: Router) {
        console.log('City route create');

        //Load Master Data
        router.get('/masterData', asyncMiddleware(async(req: Request, res: Response, next: NextFunction) => {
            MasterDataRoute.load(req, res, next);
        }));
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let vpCategories = await ViewPointCategoryModel.findCategories();
        let transCategories = await TransportationCategoryModel.findCategories();
        
        res.json({
            viewPointCategories: vpCategories,
            transportationCategories: transCategories
        });
    }
}