import { asMutable } from 'seamless-immutable';

import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../modules/store/store.model';
import { IViewPointBiz } from '../../model/viewPoint.biz.model';

export function getViewPoints(store : NgRedux<IAppState>) {
    return (data : { [id : string] : IViewPointBiz }) : Array<IViewPointBiz>=> {
        let ret = new Array<IViewPointBiz>();
        let comments = asMutable(store.getState().entities.viewPointComments);
        let viewPoints = asMutable(data,{deep: true});
        Object.keys(viewPoints).forEach(key => {
            let viewPoint = viewPoints[key];
            viewPoint.comments = viewPoint.comments.map(id => comments[id]);
            ret.push(viewPoint);
        });
        
        return ret;
    }
}