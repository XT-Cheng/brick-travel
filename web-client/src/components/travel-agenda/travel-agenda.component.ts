import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { List } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';

import {
  caculateDistance,
  IDailyTripBiz,
  ITravelAgendaBiz,
  ITravelViewPointBiz,
  createDailiyTrip,
} from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';
import { TransportationCategory } from '../../modules/store/entity/travelAgenda/travelAgenda.model';
import { DragulaService } from '../../providers/dragula.service';
import { EnumEx } from '../../utils/enumEx';

@Component({
  selector: 'travel-agenda',
  templateUrl: 'travel-agenda.component.html',
  host: { 'style': 'display: flex;' }
})
export class TravelAgendaComponent implements AfterViewInit, OnDestroy {
  //#region Private member

  private _viewPointDragHandle: any;
  private _dayDragHandle: any;

  private _vpScrollRect: any;
  private _dayScrollRect: any;

  private _vpScrollContent: any;
  private _dayScrollContent: any;

  private _dayDragSub: Subscription;
  private _viewPointDragSub: Subscription;

  @ViewChild('vpList', { read: List }) private _vpListCmp: List;
  @ViewChild('dayList', { read: List }) private _dayListCmp: List;

  @ViewChild('dayScroll', { read: ElementRef }) private _dayScroll: ElementRef;
  @ViewChild('vpScroll', { read: ElementRef }) private _vpScroll: ElementRef;

  //#endregion

  //#region Protected member

  //#endregion

  //#region Protected property
  @Input() protected travelAgenda : ITravelAgendaBiz;
  @Input() protected selectedDailyTrip: IDailyTripBiz;
  @Input() protected selectedViewPoint: IViewPointBiz;

  protected get transCategoryNameAndValues(): { name: string, value: any }[] {
    return EnumEx.getNamesAndValues(TransportationCategory)
  }

  @Output() protected dailyTripSelectedEvent: EventEmitter<IDailyTripBiz>;
  @Output() protected viewPointSelectedEvent: EventEmitter<IViewPointBiz>;

  @Output() protected dailyTripAddedEvent: EventEmitter<{ added: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }>;
  @Output() protected dailyTripRemovedEvent: EventEmitter<{ removed: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }>;

  @Output() protected travelViewPointRemovedEvent: EventEmitter<{ removed: ITravelViewPointBiz, dailyTrip: IDailyTripBiz }>;
  @Output() protected travelViewPointAddRequestEvent: EventEmitter<void>;

  @Output() protected travelAgendaChangedEvent: EventEmitter<{ dailyTrip: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }>;

  //#endregion

  //#region Private property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor(private _dragulaService: DragulaService, private _renderer: Renderer2) {
    this.dailyTripSelectedEvent = new EventEmitter<IDailyTripBiz>();
    this.viewPointSelectedEvent = new EventEmitter<IViewPointBiz>();

    this.dailyTripAddedEvent = new EventEmitter<{ added: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }>();
    this.dailyTripRemovedEvent = new EventEmitter<{ removed: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }>();

    this.travelViewPointRemovedEvent = new EventEmitter<{ removed: ITravelViewPointBiz, dailyTrip: IDailyTripBiz }>();

    this.travelViewPointAddRequestEvent = new EventEmitter<void>();

    this.travelAgendaChangedEvent = new EventEmitter<{ dailyTrip: IDailyTripBiz, travelAgenda: ITravelAgendaBiz }>();
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    this._dragulaService.dropModel.subscribe((value: any) => {
      if (this.selectedDailyTrip !== null) caculateDistance(this.selectedDailyTrip);
      this.travelAgendaChangedEvent.emit({ dailyTrip: this.selectedDailyTrip, travelAgenda: this.travelAgenda });
    });

    this._dragulaService.drag.subscribe((value: any) => {
      let bagName = value[0];
      let el = value[1];
      let source = value[2];

      if (bagName === 'vp-bag') {
        this.onViewPointDrag(el, source);
      }
      else {
        this.onDayDrag(el, source);
      }
    });

    this._dragulaService.dragend.subscribe((value: any) => {
      let bagName = value[0];
      let el = value[1];

      if (bagName === 'vp-bag') {
        this.onViewPointDragEnd(el);
      }
      else {
        this.onDayDragEnd(el);
      }
    });

    this._vpScrollContent = this._vpScroll.nativeElement.querySelector('.scroll-content');
    this._dayScrollContent = this._dayScroll.nativeElement.querySelector('.scroll-content');
  }

  ngOnDestroy(): void {
  }
  //#endregion

  //#region Public property


  //#endregion

  //#region Protected properties

  //#endregion

  //#region Protected method
  protected get dragulaOptions(): any {
    let that = this;
    let that_moves = (el: any, source: any, handle: any, sibling: any): boolean => {
      return that.moves(el, source, handle, sibling);
    };
    return { moves: that_moves };
  }

  protected dayClicked(dailyTrip: IDailyTripBiz): void {
    this.dailyTripSelectedEvent.emit(dailyTrip);
    this.viewPointSelectedEvent.emit(null);
  }

  protected travelViewPointClicked(travelViewPoint: ITravelViewPointBiz) {
    this.viewPointSelectedEvent.emit(travelViewPoint.viewPoint);
  }

  protected isSelectedDailyTrip(dailyTrip: IDailyTripBiz) {
    return { 'display': this.selectedDailyTrip && (this.selectedDailyTrip.id === dailyTrip.id) ? 'block' : 'none' };
  }

  protected getDayItemClass(dailyTrip: IDailyTripBiz) {
    return {
      'active': dailyTrip && this.selectedDailyTrip && (dailyTrip.id === this.selectedDailyTrip.id)
    };
  }

  protected getTravelViewPointItemClass(travelViewPoint: ITravelViewPointBiz) {
    return {
      'active': travelViewPoint && this.selectedViewPoint && travelViewPoint.viewPoint.id === this.selectedViewPoint.id
    }
  }

  protected removeTravelViewPoint(travelViewPoint: ITravelViewPointBiz) {
    this.selectedDailyTrip.travelViewPoints = this.selectedDailyTrip.travelViewPoints.
                                                filter(tvp => tvp.id != travelViewPoint.id);
    this.travelViewPointRemovedEvent.emit({ removed: travelViewPoint, dailyTrip: this.selectedDailyTrip });
  }

  protected addTravelViewPointReq() {
    this.travelViewPointAddRequestEvent.emit();
  }

  protected addDay() {
    //Create daily trip
    let dailyTrip: IDailyTripBiz = createDailiyTrip();
    this.travelAgenda.dailyTrips.push(dailyTrip);

    this.dailyTripAddedEvent.emit({ added: dailyTrip, travelAgenda: this.travelAgenda });
  }

  protected deleteDay(dailyTrip: IDailyTripBiz) {
    this.travelAgenda.dailyTrips = this.travelAgenda.dailyTrips.filter(trip => trip.id !== dailyTrip.id);
    this.dailyTripRemovedEvent.emit({ removed: dailyTrip, travelAgenda: this.travelAgenda });
  }

  //#endregion

  //#region Private method
  private touchMoveViewPoint(e: any) {
    this._vpScrollRect = this._vpScrollContent.getBoundingClientRect();

    if (e.touches[0].clientY < this._vpScrollRect.top)
      this._vpScrollContent.scrollTop -= 10;
    //this._vpScroll.scrollTo(0,this._vpScrollContent.scrollTop - 10);

    if (e.touches[0].clientY > this._vpScrollRect.bottom)
      this._vpScrollContent.scrollTop += 10;
    //this._vpContent.scrollTo(0,this._vpScrollContent.scrollTop + 10);
  }

  private touchMoveDay(e: any) {
    this._dayScrollRect = this._dayScrollContent.getBoundingClientRect();

    if (e.touches[0].clientY < this._dayScrollRect.top)
      this._dayScrollContent.scrollTop -= 10;
    //this._dayContent.scrollTo(0,this._dayScrollContent.scrollTop - 10);

    if (e.touches[0].clientY > this._dayScrollRect.bottom)
      this._dayScrollContent.scrollTop += 10;
    //this._dayContent.scrollTo(0,this._dayScrollContent.scrollTop + 10);
  }

  private moves(el: any, source: any, handle: any, sibling: any): boolean {
    let valid = (handle.tagName === 'I');
    if (valid) {
      if (el.children[0].classList.contains('vp-item'))
        this._viewPointDragHandle = handle;
      else
        this._dayDragHandle = handle;
    }
    return valid;
  }

  private onViewPointDrag(el: any, source: any) {
    this._vpListCmp.sliding = false;
    this._renderer.removeClass(this._vpScroll.nativeElement, 'scroll-y');
    this._viewPointDragSub = Observable.fromEvent(this._viewPointDragHandle, 'touchmove').subscribe(e => {
      this.touchMoveViewPoint(e);
    });
  }

  private onDayDrag(el: any, source: any) {
    this._dayListCmp.sliding = false;
    this._renderer.removeClass(this._dayScroll.nativeElement, 'scroll-y');
    this._dayDragSub = Observable.fromEvent(this._dayDragHandle, 'touchmove').subscribe(e => {
      this.touchMoveDay(e);
    });
  }

  private onViewPointDragEnd(el: any) {
    this._vpListCmp.sliding = true;
    this._renderer.addClass(this._vpScroll.nativeElement, 'scroll-y');
    this._viewPointDragSub.unsubscribe();
  }

  private onDayDragEnd(el: any) {
    this._dayListCmp.sliding = true;
    this._renderer.addClass(this._dayScroll.nativeElement, 'scroll-y');
    this._dayDragSub.unsubscribe();
  }

  //#endregion
}
