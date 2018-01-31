import 'rxjs/add/operator/combineLatest';

import { AfterViewInit, Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import {
  IDailyTripBiz,
  ITravelAgendaBiz,
  ITravelViewPointBiz,
  translateDailyTripFromBiz,
  translateTravelAgendaFromBiz,
  translateTravelViewPointFromBiz,
} from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { TravelAgendaActionGenerator } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { SelectorService } from '../../providers/selector.service';
import { ViewPointsSelectPage } from '../view-points-select/view-points-select.page';
import { ViewPointService } from '../../providers/viewPoint.service';

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
    private _uiActionGeneration: UIActionGenerator,
    private _travelAgendaActionGenerator: TravelAgendaActionGenerator) {
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
    this._uiActionGeneration.selectDailyTrip(dailyTrip.id);
  }

  viewPointSelected(viewPoint: IViewPointBiz) {
    this._viewPointService.select(viewPoint);
  }

  travelAgendaChanged(value: { dailyTrip: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }) {
    let dailyTrip = value.dailyTrip;
    let travelAgenda = value.travelAgenda;
    this._travelAgendaActionGenerator.updateDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));

    dailyTrip.travelViewPoints.forEach(tvp => {
      this._travelAgendaActionGenerator.updateTravelViewPoint(tvp.id, translateTravelViewPointFromBiz(tvp));
    })

    this._travelAgendaActionGenerator.updateTravelAgenda(travelAgenda.id, translateTravelAgendaFromBiz(travelAgenda));
  }

  travelViewPointAddRequest() {
    this._nav.push(ViewPointsSelectPage);
  }

  travelViewPointRemoved(value: { removed: ITravelViewPointBiz, dailyTrip: IDailyTripBiz }) {
    let dailyTrip = value.dailyTrip;
    let removed = value.removed;

    this._travelAgendaActionGenerator.deleteTravelViewPoint(removed.id, translateTravelViewPointFromBiz(removed));
    this._travelAgendaActionGenerator.updateDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
  }

  dailyTripAdded(value: { added: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }) {
    let dailyTrip = value.added;
    let travelAgeanda = value.travelAgenda;
    this._travelAgendaActionGenerator.insertDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
    this._travelAgendaActionGenerator.updateTravelAgenda(travelAgeanda.id, translateTravelAgendaFromBiz(travelAgeanda));

    this._uiActionGeneration.selectDailyTrip(dailyTrip);
  }

  dailyTripRemoved(value: { removed: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }) {
    let dailyTrip = value.removed;
    let travelAgeanda = value.travelAgenda;
    this._travelAgendaActionGenerator.deleteDailyTrip(dailyTrip.id, translateDailyTripFromBiz(dailyTrip));
    this._travelAgendaActionGenerator.updateTravelAgenda(travelAgeanda.id, translateTravelAgendaFromBiz(travelAgeanda));

    if (travelAgeanda.dailyTrips.length > 0)
      this._uiActionGeneration.selectDailyTrip(travelAgeanda.dailyTrips[0]);
    else
      this._uiActionGeneration.selectDailyTrip('');
  }
  //#endregion

  //#region Private method

  //#endregion
}
