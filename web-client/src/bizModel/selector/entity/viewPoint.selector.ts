import { NgRedux } from '@angular-redux/store';
import { denormalize } from 'normalizr';
import { Observable } from 'rxjs/Rx';
import * as Immutable from 'seamless-immutable';

import { viewPoint } from '../../../modules/store/entity/entity.schema';
import { IViewPoint } from '../../../modules/store/entity/viewPoint/viewPoint.model';
import { IAppState } from '../../../modules/store/store.model';
import { IViewPointBiz } from '../../model/viewPoint.biz.model';

export function getViewPoints(store : NgRedux<IAppState>) : Observable<IViewPointBiz[]> {
    return store.select<{ [id: string]: IViewPoint }>(['entities', 'viewPoints'])
    .map(getViewPointsInternal(store));
}

function getViewPointsInternal(store : NgRedux<IAppState>) {
    return (data : { [id : string] : IViewPoint }) : IViewPointBiz[] => {
        return denormalize(Object.keys(data),[ viewPoint ],Immutable(store.getState().entities).asMutable({deep: true}));
    }
}