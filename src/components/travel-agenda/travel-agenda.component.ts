import { NgRedux } from '@angular-redux/store/lib/src/components/ng-redux';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { IAppState } from '../../modules/store/store.model';
import { getSelectedTravelAgenda } from '../../bizModel/selector/ui/travelAgenda.selector';
import { ITravelAgendaBiz, IDailyTripBiz } from '../../bizModel/model/travelAgenda.biz.model';

@Component({
  selector: 'travel-agenda',
  templateUrl: 'travel-agenda.component.html'
})
export class TravelAgendaComponent implements AfterViewInit,OnDestroy {
  //#region Private member

  private _unSubs : Array<Subscription> = new Array<Subscription>();
  
  //#endregion

  //#region Protected member
  protected selectedTravelAgenda$: Observable<ITravelAgendaBiz>;
  protected travelAgenda : ITravelAgendaBiz;
  protected selectedDailyTrip : IDailyTripBiz;
  //#endregion

  //#region Private property

  //#endregion

  //#region Event
  
  //#endregion

  //#region Constructor
  constructor(private _store: NgRedux<IAppState>) {
    this.selectedTravelAgenda$ = this._store.select<string>(['ui', 'travelAgenda','selectedId'])
      .map(getSelectedTravelAgenda(this._store));
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    // this._unSubs.push(this.selectedTravelAgenda$.subscribe(travelAgenda => {
    //   this.travelAgenda = travelAgenda;
    // }));
  }

  ngOnDestroy(): void {
    this._unSubs.forEach(un => un.unsubscribe());
  }
  //#endregion

  //#region Public property

 
  //#endregion

  //#region Protected properties
 
  //#endregion

  //#region Protected method
  protected dayClicked(dailyTrip : IDailyTripBiz) {
    this.selectedDailyTrip = dailyTrip;
  }
  //#endregion

  //#region Private method
 
  //#endregion
}
