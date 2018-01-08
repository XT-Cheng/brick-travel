import { Router, Response, Request, NextFunction } from "express";
import { ViewPointService } from "../business/viewPoint.service";
import { ViewPointModel, ViewPoint } from "../data-model/viewPoint.model";
import { asyncMiddleware } from "../utils/utility";
//import { Mongoose, Schema, Document, model } from 'mongoose'
import * as mongoose from 'mongoose';
import { TravelAgendaModel } from "../data-model/travelAgenda.model";

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