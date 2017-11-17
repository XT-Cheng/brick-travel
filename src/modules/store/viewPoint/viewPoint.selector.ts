import { asMutable } from 'seamless-immutable';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store.model';
import { IViewPoint } from './viewPoint.model';

export function getViewPoints(store : NgRedux<IAppState> ) {
    return (data : { [id : string] : IViewPoint }) => {
        let ret = new Array<IViewPoint>();
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