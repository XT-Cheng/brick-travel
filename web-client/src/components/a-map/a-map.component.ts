import {
  AfterViewInit,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { InformationWindowComponent } from './information-window/information-window.component';
import { ViewPointMarkerComponent } from './viewpoint-marker/viewpoint-marker.component';
import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from 'shared/@core/store/bizModel/travelAgenda.biz.model';
import { IViewPointBiz } from 'shared/@core/store/bizModel/viewPoint.biz.model';
import { ICityBiz } from 'shared/@core/store/bizModel/city.biz.model';

@Component({
  selector: 'a-map',
  templateUrl: 'a-map.component.html'
})
export class AMapComponent implements AfterViewInit {
  //#region Private member
  @ViewChild('map') private _mapElement: ElementRef;

  private _map: AMap.Map = null;
  private _viewPointMarkerFactory: ComponentFactory<ViewPointMarkerComponent>;
  private _informationWindowFactory: ComponentFactory<InformationWindowComponent>;
  private _markers: Map<string, MarkerInfor>;
  private _travelLines: Array<AMap.Polyline>;
  private _dailyTrip: IDailyTripBiz = null;
  private _viewPoints: Array<IViewPointBiz> = new Array<IViewPointBiz>();
  private _viewMode: boolean;

  //#endregion

  //#region Event
  @Output() viewPointClickedEvent: EventEmitter<IViewPointBiz>;
  @Output() viewPointAddedToDailyTrip: EventEmitter<{ dailyTrip: IDailyTripBiz, added: IViewPointBiz }>;
  @Output() viewPointRemovedFromDailyTrip: EventEmitter<{dailyTrip: IDailyTripBiz,travelAgenda : ITravelAgendaBiz,removed: ITravelViewPointBiz}>;
  
  //#endregion

  //#region Protected property
  @Input() protected set viewMode(viewMode: boolean) {
    this._viewMode = viewMode;

    this._markers.forEach(marker => {
      marker.windowComponent.instance.actionAllowed = this.actionAllowed(marker.viewPoint);
      marker.windowComponent.instance.detectChanges();
    })
  }

  protected get viewMode(): boolean {
    return this._viewMode;
  }

  @Input()
  protected city : ICityBiz;

  @Input()
  protected set viewPoints(viewPoints: Array<IViewPointBiz>) {
    this._viewPoints = viewPoints;

    if (this._map == null) return;
    
    this.generateViewPoints();
  }

  @Input()
  protected set dailyTrip(dailyTrip: IDailyTripBiz) {    
    this._dailyTrip = dailyTrip;

    if (this._map == null) return;
    
    this.generateDailyTrip();
  }

  protected get dailyTrip(): IDailyTripBiz {
    return this._dailyTrip;
  }

  @Input() protected set selectedViewPoint(vp: IViewPointBiz) {
    if (!vp) return;

    this._markers.forEach(marker => {
      if (marker.viewPoint.id === vp.id) {
        this._map.setCenter(marker.marker.getPosition());
        // marker.marker.setAnimation("AMAP_ANIMATION_BOUNCE");
        // setTimeout(() => {
        //   marker.marker.setAnimation("AMAP_ANIMATION_NONE");
        // }, 2000);
      }
    })
  }

  @Input() protected travelAgenda : ITravelAgendaBiz;

  //#endregion 

  //#region Constructor

  constructor(private _resolver: ComponentFactoryResolver, private _injector: Injector) {
    this._markers = new Map<string, MarkerInfor>();
    this._travelLines = new Array<AMap.Polyline>();
    this._viewPointMarkerFactory = this._resolver.resolveComponentFactory(ViewPointMarkerComponent);
    this._informationWindowFactory = this._resolver.resolveComponentFactory(InformationWindowComponent);

    this.viewPointClickedEvent = new EventEmitter<IViewPointBiz>();
    this.viewPointAddedToDailyTrip = new EventEmitter<{ dailyTrip: IDailyTripBiz, added: IViewPointBiz }>();
    this.viewPointRemovedFromDailyTrip = new EventEmitter<{dailyTrip: IDailyTripBiz,travelAgenda : ITravelAgendaBiz,removed: ITravelViewPointBiz}>();
  }

  //#endregion Constructor

  //#region Implements interface
  ngAfterViewInit(): void {
    this._map = new AMap.Map(this._mapElement.nativeElement, {});
    this.loadPlugin();

    if (this._viewPoints.length >0)
      this.generateViewPoints();

    if (this._dailyTrip)
      this.generateDailyTrip();
  }

  //#endregion Implements interface

  //#region Public methods
  public setFitView() {
      this._map.setFitView();
  }

  public setCity() {
    this._map.setCity(this.city.adressCode);
  }
  //#endregion

  //#region Private method
  @HostListener('transitionend', ['$event.target'])
  private transitionEnd(target : any) {
    this._map.setFitView();
  }

  private generateDailyTrip() {
    //Update all of markers as viewPoint 
    for (let [, markerInfor] of this._markers.entries()) {
      this.updateMarkerInfor(markerInfor, markerInfor.viewPoint, this.actionAllowed(markerInfor.viewPoint), false, -1);
    }

    if (!this._dailyTrip) {
      this.destroyExtraMarkers(new Array<string>(), false);
      this._map.remove(this._travelLines);
      this._travelLines = new Array<AMap.Polyline>();
      this.setWindowActionAllowed(ActionAllowed.NONE);
      return;
    }

    this.destroyExtraMarkers(this._dailyTrip.travelViewPoints.map(tvp => tvp.viewPoint.id), false);

    let viewPoints = (<ITravelViewPointBiz[]>this._dailyTrip.travelViewPoints).map(tvp => tvp.viewPoint);

    let sequence = 0;

    viewPoints.forEach(viewPoint => {
      //Find it
      let found = this._markers.get(viewPoint.id);

      if (!found) {
        //Not found, create it
        this.generateMarker(viewPoint, this.actionAllowed(viewPoint), true, sequence);
      }
      else {
        //Found, update it
        this.updateMarkerInfor(found, viewPoint, this.actionAllowed(viewPoint), true, sequence);
      }

      sequence++;
    });

    this.generateLines();

    this.setFitView();
  }

  private generateViewPoints() {
    //Destroy markers which 1. not belongs to this._viewPoints and 2. not belongs to this._dailyTrip
    this.destroyExtraMarkers(this._viewPoints.map(vp => vp.id), true);

    this._viewPoints.forEach(viewPoint => {
      //Find it
      let found = this._markers.get(viewPoint.id);

      if (!found) {
        //Not found, create it
        this.generateMarker(viewPoint, this.actionAllowed(viewPoint), false, -1);
      }
      else {
        //Found, update it with viewPoint
        this.updateMarkerInfor(found, viewPoint, this.actionAllowed(viewPoint), 
                  found.markerComponent.instance.inCurrentTrip, found.markerComponent.instance.sequence);
      }
    });

    this.setFitView();
  }

  private loadPlugin() {
    AMap.plugin(['AMap.ToolBar', 'AMap.Geolocation'], () => {
      this._map.addControl(new AMap.ToolBar({ locate: false, position: "RB" }));
    });
  }

  private setWindowActionAllowed(actionAllowed: ActionAllowed) {
    this._markers.forEach(vpInfo => {
      vpInfo.windowComponent.instance.actionAllowed = actionAllowed;
      vpInfo.windowComponent.instance.detectChanges();
    })
  }

  //#region Generate line
  private generateLines() {
    this._map.remove(this._travelLines);
    this._travelLines = new Array<AMap.Polyline>();

    let linePoints: Array<AMap.LngLat> = new Array<AMap.LngLat>();
    let markerInfors = Array.from(this._markers.values());

    markerInfors.sort((a, b) => {
      return a.markerComponent.instance.sequence - b.markerComponent.instance.sequence;
    });

    markerInfors.forEach(marker => {
      if (marker.markerComponent.instance.inCurrentTrip)
        linePoints.push(marker.marker.getPosition());
    });

    this._travelLines.push(new AMap.Polyline({
      path: linePoints,       //设置线覆盖物路径
      strokeColor: "#008000", //线颜色
      strokeOpacity: 0.5,       //线透明度
      strokeWeight: 3,        //线宽
      strokeStyle: "solid",   //线样式
      strokeDasharray: [10, 5], //补充线样式
      map: this._map
    }));
  }
  //#endregion

  //#region Update MarkerInfor
  private updateMarkerInfor(markerInfo: MarkerInfor, viewPoint: IViewPointBiz, actionAllowed: ActionAllowed, inCurrentTrip: boolean, sequence: number) {
    markerInfo.viewPoint = viewPoint;

    markerInfo.marker.setPosition(new AMap.LngLat(viewPoint.longtitude, viewPoint.latitude));

    markerInfo.markerComponent.instance.viewPoint = viewPoint;
    markerInfo.markerComponent.instance.inCurrentTrip = inCurrentTrip;
    markerInfo.markerComponent.instance.sequence = sequence;
    markerInfo.markerComponent.instance.detectChanges();

    markerInfo.windowComponent.instance.actionAllowed = this.actionAllowed(viewPoint);
    markerInfo.windowComponent.instance.viewPoint = viewPoint;
    markerInfo.windowComponent.instance.detectChanges();
  }
  //#endregion Update MarkerInfo

  //#region Generate ViewPoint marker
  private generateMarker(viewPoint: IViewPointBiz, actionAloowed: ActionAllowed, inCurrentTrip: boolean, sequence: number) {
    let point = new AMap.LngLat(viewPoint.longtitude, viewPoint.latitude);

    //Create Marker Component
    let crMarker = this._viewPointMarkerFactory.create(this._injector);
    let marker: AMap.Marker = new AMap.Marker({
      content: (<any>crMarker.hostView).rootNodes[0],
      position: point,
      title: '',
      offset: new AMap.Pixel(-1 * ViewPointMarkerComponent.WIDTH / 2, -1 * ViewPointMarkerComponent.HEIGHT),
      map: this._map
    });

    //#region Standard AMap Marker
    // new AMap.Marker({
    //   position: point,
    //   offset: new AMap.Pixel(0, 0),
    //   map: this._map,
    //   animation: "AMAP_ANIMATION_BOUNCE"
    // });
    // this._map.setZoomAndCenter(18,point);
    //#endregion

    marker.setExtData(viewPoint);
    crMarker.instance.viewPoint = viewPoint;
    crMarker.instance.inCurrentTrip = inCurrentTrip;
    crMarker.instance.sequence = sequence;
    crMarker.instance.detectChanges();

    //Create Window Component
    let crWindow = this._informationWindowFactory.create(this._injector);
    let window = new AMap.InfoWindow({
      isCustom: true,
      content: (<any>crWindow.hostView).rootNodes[0],
      closeWhenClickMap: true,
      offset: new AMap.Pixel(0, -1 * ViewPointMarkerComponent.HEIGHT),
    });
    crWindow.instance.viewPoint = viewPoint;
    crWindow.instance.actionAllowed = actionAloowed;
    let subscriptions = new Array<Subscription>();
    subscriptions.push(crWindow.instance.viewPointClickedEvent.subscribe(viewPoint => {
      this._markers.get(viewPoint.id).window.close();
      this.viewPointClickedEvent.emit(viewPoint);
    }));
    subscriptions.push(crWindow.instance.viewPointAddedEvent.subscribe(viewPoint => {
      this._markers.get(viewPoint.id).window.close();
      this.viewPointAddedToDailyTrip.emit({dailyTrip: this.dailyTrip,added : viewPoint})
    }));
    subscriptions.push(crWindow.instance.viewPointRemovedEvent.subscribe(viewPoint => {
      this._markers.get(viewPoint.id).window.close();
      
      //Remove viewpoint
      let removed = this.dailyTrip.travelViewPoints.find(tvp => tvp.viewPoint.id == viewPoint.id)
      this.dailyTrip.travelViewPoints =
        this.dailyTrip.travelViewPoints.filter(tvp => tvp.viewPoint.id != viewPoint.id);
        this.viewPointRemovedFromDailyTrip.emit({dailyTrip: this.dailyTrip,travelAgenda : this.travelAgenda,removed: removed})
    }));
    crWindow.instance.detectChanges();

    let markerClickListener = AMap.event.addListener(marker, "click", ($event: any) => {
      let marker = <AMap.Marker>$event.target;
      let viewPoint = <IViewPointBiz>marker.getExtData();

      if (this._markers.has(viewPoint.id)) {
        this._map.setCenter(marker.getPosition());
        let window = this._markers.get(viewPoint.id).window;
        setTimeout(() => window.open(this._map, marker.getPosition()), 300);

      }
    });

    this._markers.set(viewPoint.id, {
      marker: marker,
      markerComponent: crMarker,
      viewPoint: viewPoint,
      window: window,
      windowComponent: crWindow,
      markerClickListener: markerClickListener,
      suscriptions: subscriptions
    });
  }
  //#endregion

  private destroyMarker(viewPointId: string) {
    let markerInfor = this._markers.get(viewPointId);

    if (markerInfor) {
      this._map.remove(markerInfor.marker);
      this._map.remove(markerInfor.window);

      markerInfor.suscriptions.forEach(sub => sub.unsubscribe());
      AMap.event.removeListener(markerInfor.markerClickListener);

      markerInfor.markerComponent.destroy();
      markerInfor.windowComponent.destroy();

      this._markers.delete(viewPointId);
    }
  }

  private isInCurrentTrip(viewPoint: IViewPointBiz): boolean {
    let ret = false;

    if (this.dailyTrip) {
      this.dailyTrip.travelViewPoints.forEach(tvp => {
        if (viewPoint.id === tvp.viewPoint.id)
          ret = true;
      });
    }

    return ret;
  }

  private actionAllowed(viewPoint: IViewPointBiz): ActionAllowed {
    if (!this._viewMode && this._dailyTrip) {
      if (this.isInCurrentTrip(viewPoint))
        return ActionAllowed.REMOVE;
      return ActionAllowed.ADD;
    }

    return ActionAllowed.NONE;
  }

  private destroyExtraMarkers(remains: Array<string>, isViewPoints: boolean) {
    let toBeRemoved: Array<string> = new Array<string>();

    if (isViewPoints) {
      //remains should be new viewPoints Ids
      toBeRemoved = Array.from(this._markers.keys()).filter(key => {
        //Preserve if marker belongs to current dailyTrip
        if (this._dailyTrip && this._dailyTrip.travelViewPoints.find(tvp => tvp.viewPoint.id === key))
          return false;

        //Preserve if marker included in new viewPoints Ids
        return !remains.find(remain => remain === key);
      });
    }
    else {
      //remains should be new dailyTrip viewPoints Ids
      toBeRemoved = Array.from(this._markers.keys()).filter(key => {
        //Preserve if marker belongs to current viewPoints
        if (this._viewPoints && this._viewPoints.find(vp => vp.id === key))
          return false;

        //Preserve if marker included in new dailyTrip viewPoints Ids
        return !remains.find(remain => remain === key);
      });
    }

    toBeRemoved.forEach(remove => this.destroyMarker(remove));
  }
  //#endregion Private method
}

export enum ActionAllowed {
  ADD,
  REMOVE,
  NONE
}

export enum MapMode {
  DailyTrip,
  ViewPoint
}

export interface MarkerInfor {
  marker: AMap.Marker,
  markerComponent: ComponentRef<ViewPointMarkerComponent>,
  markerClickListener: any,
  viewPoint: IViewPointBiz,
  window: AMap.InfoWindow;
  windowComponent: ComponentRef<InformationWindowComponent>;
  suscriptions: Array<Subscription>
}