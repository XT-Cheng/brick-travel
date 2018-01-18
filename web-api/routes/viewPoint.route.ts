import { Router, Response, Request, NextFunction } from "express";
import { ViewPointService } from "../business/viewPoint.service";
import { ViewPointModel, ViewPoint } from "../data-model/viewPoint.model";
import { asyncMiddleware } from "../utils/utility";
//import { Mongoose, Schema, Document, model } from 'mongoose'
import * as mongoose from 'mongoose';

export class ViewPointRoute {
    public static create(router: Router) {
        console.log('ViewPoint route create');

        //Load ViewPoint comments (pagination) by ViewPoint id
        router.get('/viewPoints/:id/comments', (req: Request, res: Response, next: NextFunction) => {
            ViewPointRoute.loadComments(req, res, next);
        });

        //Load ViewPoint with some comments retrieved
        router.get('/viewPoints', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.load(req, res, next);
        }));

        //Load ViewPoint by City with some comments retrieved
        router.get('/:cityId/viewPoints', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.load(req, res, next);
        }));

        //Insert ViewPoint
        router.post('/viewPoints', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.insert(req, res, next);
        }));

        //Insert ViewPoint comment by ViewPoint id
        router.post('/viewPoints/:id/comment', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.addComment(req, res, next);
        }));
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await ViewPointModel.createViewPoint(req.body);
        res.json(true);
    }

    private static async addComment(req: Request, res: Response, next: NextFunction) {
        let viewPoint = await ViewPointModel.findById(req.params.id)
        if (viewPoint == null) throw new Error("ViewPoint Id " + req.params.id + " not exist");
        await viewPoint.addComment(req.body);

        res.json(true);
    }

    private static async loadComments(req: Request, res: Response, next: NextFunction) {
        var vp = await ViewPointModel.loadComments(req.params.id, parseInt(req.query['skip']));
        res.json(vp);
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await ViewPointModel.findViewPoints();
        res.json(ret);
    }

    private static async loadByCity(req: Request, res: Response, next: NextFunction) {
        let ret = await ViewPointModel.findViewPointsByCity(req.params.cityId);
        res.json(ret);
    }
}