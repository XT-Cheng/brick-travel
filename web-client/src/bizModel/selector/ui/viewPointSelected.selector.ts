import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../modules/store/store.model';
import { IViewPointBiz } from '../../model/viewPoint.biz.model';
import { getViewPoints } from '../entity/viewPoint.selector';

function getSelectedViewPointId(store: NgRedux<IAppState>): Observable<string> {
    return store.select<string>(['ui', 'viewPoint', 'selectedViewPointId']);
}

function getViewPointById(viewPointId: string, viewPoints: IViewPointBiz[]): IViewPointBiz {
    let found = null;
    viewPoints.forEach(viewPoint => {
            if (viewPoint._id === viewPointId) {
                found = viewPoint;
        }
    })
    return found;
}

export function getSelectedViewPoint(store: NgRedux<IAppState>): Observable<IViewPointBiz> {
    return getSelectedViewPointId(store).combineLatest(getViewPoints(store), (v1, v2) => {
        return getViewPointById(v1, v2);
    });
}