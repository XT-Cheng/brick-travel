import { NextFunction, Request, Response, Router } from 'express';

import { TravelAgendaModel } from '../data-model/travelAgenda.model';
import { asyncMiddleware } from '../utils/utility';

export class TravelAgendaRoute {
    public static create(router: Router) {
        console.log('Travel Agenda route create');

        //Insert Travel Agenda
        router.post('/travelAgendas', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await TravelAgendaRoute.insert(req, res, next);
        }));

        //Load Travel Agendas
        router.get('/travelAgendas', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await TravelAgendaRoute.load(req, res, next);
        }));
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await TravelAgendaModel.createTravelAgenda(req.body);
        res.json(true);
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await TravelAgendaModel.findTravelAgendas();
        res.json(ret);
    }
}