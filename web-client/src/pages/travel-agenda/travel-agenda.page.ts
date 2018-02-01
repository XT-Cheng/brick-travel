import 'rxjs/add/operator/combineLatest';

import { AfterViewInit, Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { SelectorService } from '../../providers/selector.service';
import { TravelAgendaService } from '../../providers/travelAgenda.service';
import { ViewPointService } from '../../providers/viewPoint.service';
import { ViewPointsSelectPage } from '../view-points-select/view-points-select.page';

@Component({
  selector: 'page-travel-agenda',
  templateUrl: 'travel-agenda.page.html'
})
export class TravelAgendaPage implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Protected member

  protected selectedDailyTrip$: Observable<IDailyTripBiz>;
  protected selectedViewPoint$: Observable<IViewPointBiz>;
  protected selectedTravelAgenda$: Observable<ITravelAgendaBiz>;

  //#endregion

  //#region Constructor
  constructor(private _nav: NavController,
    private _selector:SelectorService,
    private _viewPointService:ViewPointService,
    private _travelAgendaService: TravelAgendaService) {
    this.selectedDailyTrip$ = this._selector.selectedDailyTrip;
    this.selectedViewPoint$ = this._selector.selectedViewPoint; 
    this.selectedTravelAgenda$ =  this._selector.selectedTravelAgenda;
  }
  //#endregion

  //#region Implements interface
  ngAfterViewInit(): void {
  }

  //#endregion

  //#region Protected method
  dailyTripSelected(dailyTrip: IDailyTripBiz) {
    this._travelAgendaService.selectDailyTrip(dailyTrip);
  }

  viewPointSelected(viewPoint: IViewPointBiz) {
    this._viewPointService.select(viewPoint);
  }

  travelAgendaChanged(value: { dailyTrip: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }) {
    // let dailyTrip = value.dailyTrip;
    // let travelAgenda = value.travelAgenda;
    // this._travelAgendaService.updateDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));

    // dailyTrip.travelViewPoints.forEach(tvp => {
    //   this._travelAgendaService.updateTravelViewPoint(tvp.id, translateTravelViewPointFromBiz(tvp));
    // })

    // this._travelAgendaService.updateTravelAgenda(travelAgenda.id, translateTravelAgendaFromBiz(travelAgenda));
  }

  travelViewPointAddRequest() {
    this._nav.push(ViewPointsSelectPage);
  }

  travelViewPointRemoved(value: { removed: ITravelViewPointBiz, dailyTrip: IDailyTripBiz }) {
    this._travelAgendaService.removeTravelViewPoint(value.removed,value.dailyTrip);
  }

  dailyTripAdded(value: { added: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }) {
    this._travelAgendaService.selectDailyTrip(this._travelAgendaService.addDailyTrip(value.travelAgenda));
  }

  dailyTripRemoved(value: { removed: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }) {
    this._travelAgendaService.removeDailyTrip(value.removed,value.travelAgenda);

    if (value.travelAgenda.dailyTrips.length > 0)
      this._travelAgendaService.selectDailyTrip(value.travelAgenda.dailyTrips[0]);
  }
  //#endregion

  //#region Private method

  //#endregion
}
