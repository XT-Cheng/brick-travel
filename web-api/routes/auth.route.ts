import { NextFunction, Request, Response, Router } from 'express';

import { CityModel } from '../data-model/city.model';
import { asyncMiddleware } from '../utils/utility';

import * as jwt from 'jsonwebtoken';
import * as fs from "fs";

const RSA_PRIVATE_KEY = fs.readFileSync('./jwtRS256.key');

export class AuthRoute {
    public static create(router: Router) {
        console.log('Auth route create');

        router.post('/auth/login', asyncMiddleware(async(req: Request, res: Response, next: NextFunction) => {
            AuthRoute.login(req, res, next);
        }));
    }

    private static async login(req: Request, res: Response, next: NextFunction) {
        const email = req.body.email;
        const password = req.body.password;

        //if (validateEmailAndPassword()) {
        //    const userId = findUserIdForEmail(email);
            const userId = 'test';
            const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 120,
                subject: userId
            });

          // send the JWT back to the user
          // TODO - multiple options available         
          
          res.cookie("SESSIONID", jwtBearerToken);
          res.json(true);
    }
}