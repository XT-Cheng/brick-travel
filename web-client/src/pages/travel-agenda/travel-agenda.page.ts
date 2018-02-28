import 'rxjs/add/operator/combineLatest';

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../../modules/store/bizModel/model/travelAgenda.biz.model';
import { AMapComponent } from '../../components/a-map/a-map.component';
import { SelectorService } from '../../modules/store/providers/selector.service';
import { TravelAgendaService } from '../../modules/store/providers/travelAgenda.service';
import { ViewPointService } from '../../modules/store/providers/viewPoint.service';
import { ViewPointsSelectPage } from '../view-points-select/view-points-select.page';

@Component({
  selector: 'page-travel-agenda',
  templateUrl: 'travel-agenda.page.html'
})
export class TravelAgendaPage implements AfterViewInit {
  //#region Private member
  @ViewChild(AMapComponent) private _map: AMapComponent;
  //#endregion

  //#region Protected member
  isMapHide : boolean = false;

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

  ionViewDidLoad() :void {
    this._map.setCity();
  }
  //#endregion

  //#region Protected method
  hideMap() {
    this.isMapHide = !this.isMapHide;
  }

  publish() {
    //this._travelAgendaService.publish();
    //this._dataSyncService.saveToLocal();
  }

  tranportationChanged(travelViewPoint : ITravelViewPointBiz) {
    this._travelAgendaService.updateTraveViewPoint(travelViewPoint);
  }

  dailyTripSelected(dailyTrip: IDailyTripBiz) {
    this._travelAgendaService.selectDailyTrip(dailyTrip);
  }

  travelViewPointSelected(travelViewPoint: ITravelViewPointBiz) {
    this._travelAgendaService.selectTravlViewPoint(travelViewPoint);
    this._viewPointService.selectViewPoint(travelViewPoint?travelViewPoint.viewPoint:null);
  }

  travelViewPointSwitched(dailyTrip : IDailyTripBiz) {
    this._travelAgendaService.switchTravelViewPoint(dailyTrip);
  }

  dailyTripSwitched(travelAgenda : ITravelAgendaBiz) {
    this._travelAgendaService.swtichDailyTrip(travelAgenda);
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
    this._viewPointService.setViewMode(false);
    this._nav.push(ViewPointsSelectPage);
  }

  travelViewPointRemoved(travelViewPoint: ITravelViewPointBiz) {
    this._travelAgendaService.removeTravelViewPoint(travelViewPoint);
  }

  dailyTripAdded(travelAgenda: ITravelAgendaBiz) {
    this._travelAgendaService.addDailyTrip(travelAgenda);
  }

  dailyTripRemoved(dailyTrip: IDailyTripBiz) {
   this._travelAgendaService.removeDailyTrip(dailyTrip);
  }
  //#endregion

  //#region Private method

  //#endregion
}
