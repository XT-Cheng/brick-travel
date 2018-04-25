import { IUser } from '../../entity/model/user.model';
import { IBiz } from '../biz.model';

export interface IUserBiz extends IBiz {
  name: string;
  nick: string;
  picture: string;
}

export function translateUserFromBiz(user: IUserBiz): IUser {
  return {
    id: user.id,
    name: user.name,
    nick: user.nick,
    picture: user.picture
  };
}

