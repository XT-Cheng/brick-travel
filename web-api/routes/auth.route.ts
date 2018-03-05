import { NextFunction, Request, Response, Router } from 'express';

import { CityModel } from '../data-model/city.model';
import { asyncMiddleware } from '../utils/utility';

import * as jwt from 'jsonwebtoken';
import * as fs from "fs";
import { UserModel } from '../data-model/user.model';

const RSA_PRIVATE_KEY = fs.readFileSync('./jwtRS256.key');

export class AuthRoute {
    public static create(router: Router) {
        console.log('Auth route create');

        router.post('/auth/login', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            AuthRoute.login(req, res, next);
        }));
    }

    private static async login(req: Request, res: Response, next: NextFunction) {
        let errorMsg : string = '';
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findByName(email);

        if (!user) {
            errorMsg = `User ${email} not exist`;
            res.status(403).json({errors: errorMsg})
        }
        else if (user.password != password) {
            errorMsg = `Password not correct`;
            res.status(403).json({errors: errorMsg})
        }
        else {
            const jwtBearerToken = jwt.sign({
                name: user.name,
                nick: user.nick,
                picture: user.picture,
                id: user.id
            }, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 120,
                subject: user.name
            });
            res.status(200).json({
                idToken: jwtBearerToken
            });
        }
    }
}