import 'rxjs/add/operator/combineLatest';

import { NgRedux } from '@angular-redux/store';
import { AfterViewInit, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
    IDailyTripBiz,
    ITravelAgendaBiz,
    translateDailTrip,
    translateTravelAgenda,
} from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { getSelectedDailyTrip } from '../../bizModel/selector/ui/dailyTripSelected.selector';
import { getSelectedTravelAgenda } from '../../bizModel/selector/ui/travelAgendaSelected.selector';
import { getSelectedViewPoint } from '../../bizModel/selector/ui/viewPointSelected.selector';
import { TravelAgendaActionGenerator } from '../../modules/store/entity/travelAgenda/travelAgenda.action';
import { IAppState } from '../../modules/store/store.model';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { NavController } from 'ionic-angular';
import { ViewPointsPage } from '../view-points/view-points.page';

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
    private _store: NgRedux<IAppState>,
    private _uiActionGeneration: UIActionGenerator,
    private _travelAgendaActionGenerator: TravelAgendaActionGenerator) {
      this.selectedDailyTrip$ = getSelectedDailyTrip(this._store);
      this.selectedViewPoint$ = getSelectedViewPoint(this._store);
      this.selectedTravelAgenda$ = getSelectedTravelAgenda(this._store);
  }
//#endregion

//#region Implements interface
  ngAfterViewInit(): void {
    this._uiActionGeneration.selectTravelAgenda('1');
  }

  //#endregion

  //#region Protected method
  dailyTripSelected(dailyTrip : IDailyTripBiz) {
    this._uiActionGeneration.selectDailyTrip(dailyTrip.id);
  }

  viewPointSelected(viewPoint : IViewPointBiz) {
    this._uiActionGeneration.selectViewPoint(viewPoint);
  }

  travelAgendaChanged(value : {dailyTrip : IDailyTripBiz, travelAgenda : ITravelAgendaBiz}) {
    let dailyTrip = value.dailyTrip;
    let travelAgeanda = value.travelAgenda;
    this._travelAgendaActionGenerator.updateDailyTrip(dailyTrip.id,translateDailTrip(dailyTrip));
    this._travelAgendaActionGenerator.updateTravelAgenda(travelAgeanda.id,translateTravelAgenda(travelAgeanda));
  }

  travelViewPointAddRequest() {
    this._nav.push(ViewPointsPage);
  }

  dailyTripAdded(value : {added : IDailyTripBiz, travelAgenda : ITravelAgendaBiz}) {
    let dailyTrip = value.added;
    let travelAgeanda = value.travelAgenda;
    this._travelAgendaActionGenerator.insertDailyTrip(dailyTrip.id,translateDailTrip(dailyTrip));
    this._travelAgendaActionGenerator.updateTravelAgenda(travelAgeanda.id,translateTravelAgenda(travelAgeanda));
  
    this._uiActionGeneration.selectDailyTrip(dailyTrip);
  }

  dailyTripRemoved(value : {removed : IDailyTripBiz, travelAgenda : ITravelAgendaBiz}) {
    let dailyTrip = value.removed;
    let travelAgeanda = value.travelAgenda;
    this._travelAgendaActionGenerator.deleteDailyTrip(dailyTrip.id,translateDailTrip(dailyTrip));
    this._travelAgendaActionGenerator.updateTravelAgenda(travelAgeanda.id,translateTravelAgenda(travelAgeanda));
  
    this._uiActionGeneration.selectDailyTrip('');
  }
  //#endregion

  //#region Private method

  //#endregion
}
