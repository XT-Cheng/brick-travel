import { Observable } from "rxjs/Observable";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../../../modules/store/store.model";

export function getViewPointSearch(store : NgRedux<IAppState>) : Observable<string> {
    return store.select<string>(['ui', 'viewPoint', 'searchKey']);
}