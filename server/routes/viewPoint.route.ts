import { Router, Response, Request, NextFunction } from "express";
import { ViewPointService } from "../business/viewPoint.service";

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

export class ViewPointRoute {
    public static create(router: Router) {
        console.log('ViewPoint route create');

        //Load ViewPoint comments (pagination) by ViewPoint id
        router.get('/viewPoints/:id/comment', (req: Request, res: Response, next: NextFunction) => {
            ViewPointRoute.loadComment(req, res, next);
        });

        //Update ViewPoint
        router.put('/viewPoints/:id', (req: Request, res: Response, next: NextFunction) => {
            //ViewPointRoute.update(req,res,next);
        })

        //Insert ViewPoint
        router.post('/viewPoints', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.insert(req, res, next);
        }));

        //Insert ViewPoint comment by ViewPoint id
        router.post('/viewPoints/:id/comment', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.addComment(req, res, next);
        }));

        //Load ViewPoint with some comments retrieved
        router.get('/viewPoints', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.load(req, res, next);
        }));
    }

    private static loadComment(req: Request, res: Response, next: NextFunction) {
        // let id = req.params.id;
        // let skip : number = parseInt(req.query['skip']);
        // let limit : number = parseInt(req.query['limit']);

        // ViewPointService.loadComment(id,skip,limit)
        // .then((value) => {
        //     res.json(value);
        // })
        // .catch(err => {
        //     next(err);
        // });
    }


    private static async insert(req: Request, res: Response, next: NextFunction) {
        await ViewPointService.insert(req.body);
        res.json(true);
    }

    private static async addComment(req: Request, res: Response, next: NextFunction) {
        await ViewPointService.addComment(req.params.id, req.body);
        res.json(true);
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await ViewPointService.load();
        res.json(ret);
    }
}