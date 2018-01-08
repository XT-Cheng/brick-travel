import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { Observable } from 'rxjs/Rx';

import { IAppState } from '../../../modules/store/store.model';

export function getViewMode(store: NgRedux<IAppState>): Observable<boolean> {
    return store.select<boolean>(['ui', 'viewMode']);
}