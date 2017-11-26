import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';

import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { TransportationCategory } from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { EnumEx } from '../../utils/enumEx';

@Component({
  selector: 'travel-agenda',
  templateUrl: 'travel-agenda.component.html'
})
export class TravelAgendaComponent implements AfterViewInit,OnDestroy {
  //#region Private member
  private  _travelAgenda : ITravelAgendaBiz;
  
  //#endregion

  //#region Protected member
  
  protected selectedDailyTrip : IDailyTripBiz;
  
  //#endregion

  //#region Protected property
  @Input() protected set travelAgenda(ta : ITravelAgendaBiz) {
    if (ta && ta.dailyTrips && ta.dailyTrips.length >0) {
      this._travelAgenda = ta;
      this.selectedDailyTrip = ta.dailyTrips[0];
    }
  }

  protected get travelAgenda() : ITravelAgendaBiz {
    return this._travelAgenda;
  }

  protected get transCategoryNameAndValues(): {name: string,value: any }[] {
    return EnumEx.getNamesAndValues(TransportationCategory)
  }

  //#endregion

  //#region Private property

  //#endregion

  //#region Event
  
  //#endregion

  //#region Constructor
  constructor() {
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }
  //#endregion

  //#region Public property

 
  //#endregion

  //#region Protected properties
 
  //#endregion

  //#region Protected method
  protected dayClicked(dailyTrip : IDailyTripBiz) : void {
    this.selectedDailyTrip = dailyTrip;
  }

  protected isSelectedDailyTrip(dailyTrip : IDailyTripBiz) {
    return {'display': this.selectedDailyTrip === dailyTrip?'block':'none'};
  }

  protected getDayItemClass(dailyTrip: IDailyTripBiz) {
    return {
      'day-item': true,
      'active': dailyTrip === this.selectedDailyTrip
    };
  }

  protected getTravelViewPointItemClass(travelViewPoint : ITravelViewPointBiz) {
    return {
      'vp-item': true
    };
  }

  protected getTransportationItemClass(travelViewPoint : ITravelViewPointBiz) {
    return {
      'tp-item': true
    };
  }

  protected changed($event) {
    console.log('changed');  
  }
  //#endregion

  //#region Private method
 
  //#endregion
}
