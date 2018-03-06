import { NextFunction, Request, Response, Router } from 'express';

import { CityModel } from '../data-model/city.model';
import { asyncMiddleware } from '../utils/utility';

export class CityRoute {
    public static create(router: Router) {
        console.log('City route create');

        //Load Cities
        router.get('/cities', asyncMiddleware(async(req: Request, res: Response, next: NextFunction) => {
            CityRoute.load(req, res, next);
        }));

        //Insert City
        router.post('/cities', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.insert(req, res, next);
        }));

        //Update City
        router.put('/cities', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.update(req, res, next);
        }));

        //Delete City
        router.delete('/cities/:id', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.delete(req, res, next);
        }));
    }

    private static async update(req: Request, res: Response, next: NextFunction) {
        await CityModel.updateCity(req.body);
        res.json(true);
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await CityModel.findCities();
        res.json(ret);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await CityModel.createCities(req.body);
        res.json(true);
    }

    private static async delete(req: Request, res: Response, next: NextFunction) {
        await CityModel.deleteCity(req.params.id);
        res.json(true);
    }

}