
import { Observable } from 'rxjs/Rx';
import { asMutable } from 'seamless-immutable';

import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../modules/store/store.model';
import { IViewPointBiz } from '../../model/viewPoint.biz.model';
import { IViewPoint } from '../../../modules/store/entity/viewPoint/viewPoint.model';

export function getViewPoints(store : NgRedux<IAppState>) : Observable<IViewPointBiz[]> {
    return store.select<{ [id: string]: IViewPoint }>(['entities', 'viewPoints'])
    .map(getViewPointsInternal(store));
}

function getViewPointsInternal(store : NgRedux<IAppState>) {
    return (data : { [_id : string] : IViewPoint }) : IViewPointBiz[] => {
        let ret = new Array<IViewPointBiz>();
        let cities = asMutable(store.getState().entities.cities);
        let comments = asMutable(store.getState().entities.viewPointComments);
        let viewPoints = asMutable(data,{deep: true});
        Object.keys(viewPoints).forEach(key => {
            let viewPoint = viewPoints[key];
            viewPoint.city = cities[viewPoint.city];
            viewPoint.comments = viewPoint.comments.map(_id => comments[_id]);
            ret.push(viewPoint);
        });
        
        return ret;
    }
}