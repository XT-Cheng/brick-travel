import 'rxjs/add/operator/combineLatest';

import { AfterViewInit, Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  //#endregion

  //#region Constructor
  constructor(private _nav: NavController,
    private _viewPointService: ViewPointService,
    private _travelAgendaService: TravelAgendaService,
    protected selector: SelectorService) {
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

  travelViewPointRemoved(travelViewPoint: ITravelViewPointBiz) {
    this._travelAgendaService.removeTravelViewPoint(travelViewPoint);
  }

  dailyTripAdded(travelAgenda: ITravelAgendaBiz) {
    this._travelAgendaService.addDailyTrip(travelAgenda);
  }

  dailyTripRemoved(value: { dailyTrip: IDailyTripBiz, isCurrentSelect: boolean }) {
    let travelAgenda = this._travelAgendaService.removeDailyTrip(value.dailyTrip);

    if (travelAgenda.dailyTrips.length == 0)
      this._travelAgendaService.selectDailyTrip(null);
    else if (value.isCurrentSelect)
      this._travelAgendaService.selectDailyTrip(travelAgenda.dailyTrips[0]);
  }
  //#endregion

  //#region Private method

  //#endregion
}
