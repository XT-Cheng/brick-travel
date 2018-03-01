import { NextFunction, Request, Response, Router } from 'express';

import { CityModel } from '../data-model/city.model';
import { asyncMiddleware } from '../utils/utility';

export class AuthRoute {
    public static create(router: Router) {
        console.log('Auth route create');

        router.get('/auth/login', asyncMiddleware(async(req: Request, res: Response, next: NextFunction) => {
            AuthRoute.login(req, res, next);
        }));
    }

    private static async login(req: Request, res: Response, next: NextFunction) {
        let ret = await CityModel.findCities();
        res.json(ret);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await CityModel.createCity(req.body);
        res.json(true);
    }
}