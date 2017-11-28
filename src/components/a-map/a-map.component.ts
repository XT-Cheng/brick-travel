import {
    AfterViewInit,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    Injector,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';

import { IViewPoint } from '../../modules/store/entity/viewPoint/viewPoint.model';
import { InformationWindowComponent } from './information-window/information-window.component';
import { ViewPointMarkerComponent } from './viewpoint-marker/viewpoint-marker.component';
import { IDailyTripBiz, ITravelViewPointBiz } from '../../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz } from '../../bizModel/model/viewPoint.biz.model';

@Component({
  selector: 'a-map',
  templateUrl: 'a-map.component.html'
})
export class AMapComponent implements AfterViewInit,OnDestroy {
  //#region Private member
  @ViewChild('map') private _mapElement: ElementRef;

  private _map: AMap.Map = null;

  private _viewPointMarkerFactory: ComponentFactory<ViewPointMarkerComponent>;

  private _informationWindowFactory: ComponentFactory<InformationWindowComponent>;

  private _markers: Map<string, MarkerInfor>;

  private _travelLines: Array<AMap.Polyline>;
  //#endregion

  //#region Constructor
  constructor(private _resolver: ComponentFactoryResolver, private _injector: Injector) {
    this._markers = new Map<string, MarkerInfor>();

    this._travelLines = new Array<AMap.Polyline>();

    this._viewPointMarkerFactory = this._resolver.resolveComponentFactory(ViewPointMarkerComponent);

    this._informationWindowFactory = this._resolver.resolveComponentFactory(InformationWindowComponent);
  }
  //#endregion Constructor

  //#region Public property
  @Input()
  public set viewPoints(viewPoints: Array<IViewPoint>) {
    if (this._map === null) return;

    viewPoints.forEach(viewPoint => {
      //Find it
      let found = this._markers.get(viewPoint.id);

      if (!found) {
        //Not found, create it
        this.generateMarker(viewPoint, false, -1);
      }
      else {
        //Found, update it with viewPoint
        this.updateMarkerInfor(found,viewPoint,found.markerComponent.instance.isInTrip,found.markerComponent.instance.sequence);
      }
    });

    //TODO: remove this
    if (viewPoints.length > 0)
      this._map.setZoomAndCenter(14, this._markers.get(viewPoints[0].id).marker.getPosition());
    //TODO
  }

  @Input()
  public set dailyTrip(dailyTrip: IDailyTripBiz) {
    if (!dailyTrip) return;
    
    if (this._map === null) return;

    //Remove all of viewPoint from trip first 
    for (let [,markerInfor] of this._markers.entries()) {
      this.updateMarkerInfor(markerInfor,markerInfor.viewPoint,false,-1);
    }

    if (dailyTrip === null) {
      this._map.remove(this._travelLines);
      this._travelLines = new Array<AMap.Polyline>();
      this.setWindowViewMode(true);
      return;
    }

    this.setWindowViewMode(false);
    
    let viewPoints = (<ITravelViewPointBiz[]>dailyTrip.travelViewPoints).map(tvp => tvp.viewPoint);

    let sequence = 0;

    viewPoints.forEach(viewPoint => {
      //Find it
      let found = this._markers.get(viewPoint.id);

      if (!found) {
        //Not found, create it
        this.generateMarker(viewPoint, true, sequence);
      }
      else {
        //Found, update it
        this.updateMarkerInfor(found,viewPoint,true,sequence);
      }

      sequence++;
    });

    this.generateLines();
  }

  @Input() set selectedViewPoint(vp : IViewPointBiz) {
    if (!vp) return;

    this._markers.forEach(marker => {
      if (marker.viewPoint.id === vp.id) {
        this._map.setCenter(marker.marker.getPosition());
        marker.marker.setAnimation("AMAP_ANIMATION_BOUNCE");
        setTimeout(()=> {
          marker.marker.setAnimation("AMAP_ANIMATION_NONE");
        },2000);
      }
    })
  }
  
  //#endregion Public property

  //#region Implements interface
  ngAfterViewInit(): void {
    this._map = new AMap.Map(this._mapElement.nativeElement, {});
    this.loadPlugin();
  }

  ngOnDestroy(): void {
  }

  //#endregion Implements interface

  //#region Private method
  private loadPlugin() {
    AMap.plugin(['AMap.ToolBar', 'AMap.Geolocation'], () => {
      this._map.addControl(new AMap.ToolBar({ locate: false, position: "RB" }));
    });
  }

  private setWindowViewMode(viewMode : boolean) {
    this._markers.forEach(vpInfo => {
      vpInfo.windowComponent.instance.isViewMode = viewMode;
      vpInfo.windowComponent.instance.detectChanges();
    })
  }

  //#region Generate line
  private generateLines() {
    this._map.remove(this._travelLines);
    this._travelLines = new Array<AMap.Polyline>();

    let linePoints: Array<AMap.LngLat> = new Array<AMap.LngLat>();
    let markerInfors = Array.from(this._markers.values());

    markerInfors.sort((a,b) => {
      return a.markerComponent.instance.sequence - a.markerComponent.instance.sequence;
    });

    markerInfors.forEach(marker => {
      if (marker.markerComponent.instance.isInTrip)
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
  private updateMarkerInfor(markerInfo: MarkerInfor, viewPoint: IViewPoint,isInTrip: boolean,sequence : number) {
    markerInfo.viewPoint = viewPoint;
    
    markerInfo.marker.setPosition(new AMap.LngLat(viewPoint.longtitude, viewPoint.latitude));

    markerInfo.markerComponent.instance.viewPoint = markerInfo.windowComponent.instance.viewPoint = viewPoint;
    markerInfo.markerComponent.instance.isInTrip = markerInfo.windowComponent.instance.isInTrip = isInTrip;
    markerInfo.markerComponent.instance.sequence = sequence;
    markerInfo.markerComponent.instance.detectChanges();
    markerInfo.windowComponent.instance.detectChanges();
  }
  //#endregion Update MarkerInfo

  //#region Generate ViewPoint marker
  private generateMarker(viewPoint: IViewPoint, isInTrip: boolean, sequence: number) {
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
    crMarker.instance.isInTrip = isInTrip;
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
    crWindow.instance.isInTrip = isInTrip;
    crWindow.instance.detectChanges();

    let markerClickListener = AMap.event.addListener(marker, "click", ($event: any) => {
      let marker = <AMap.Marker>$event.target;
      let viewPoint = <IViewPoint>marker.getExtData();

      if (this._markers.has(viewPoint.id)) {
        let window = this._markers.get(viewPoint.id).window;
        window.open(this._map, marker.getPosition());
      }
    });

    this._markers.set(viewPoint.id, {
      marker: marker,
      markerComponent: crMarker,
      viewPoint: viewPoint,
      window: window,
      windowComponent: crWindow,
      markerClickListener: markerClickListener
    });
  }
  //#endregion

  //#endregion Private method
}

export interface MarkerInfor {
  marker: AMap.Marker,
  markerComponent: ComponentRef<ViewPointMarkerComponent>,
  markerClickListener: any,
  viewPoint: IViewPoint,
  window: AMap.InfoWindow;
  windowComponent: ComponentRef<InformationWindowComponent>;
}