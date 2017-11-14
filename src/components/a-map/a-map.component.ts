import { Component, AfterViewInit, ViewChild, ElementRef, ComponentFactory, ComponentRef, Input, ComponentFactoryResolver, Injector } from "@angular/core";
import { ViewPointMarkerComponent } from "./viewpoint-marker/viewpoint-marker.component";
import { IViewPoint } from "../../modules/store/viewPoint/model";
import { IDailyTrip, ITravelViewPoint } from "../../modules/store/travelAgenda/model";

@Component({
  selector: 'a-map',
  templateUrl: 'a-map.component.html'
})
export class AMapComponent implements AfterViewInit {
  //#region Private member
  @ViewChild('map') private _mapElement: ElementRef;

  private _map: AMap.Map = null;

  private _viewPointMarkerFactory: ComponentFactory<ViewPointMarkerComponent>;

  private _markers: Map<string, MarkerInfor>;

  //#endregion

  //#region Event

  //#endregion Event

  //#region Constructor
  constructor(private _resolver: ComponentFactoryResolver, private _injector: Injector) {
    this._markers = new Map<string, MarkerInfor>();
    
    this._viewPointMarkerFactory = this._resolver.resolveComponentFactory(ViewPointMarkerComponent);
  }
  //#endregion Constructor

  //#region Public property
  @Input()
  public set viewPoints(viewPoints: Array<IViewPoint>) {
    if (this._map === null) return;

    //Destroy ViewPoint Markers first
    this.destroyViewPointMarkers();

    viewPoints.forEach(viewPoint => {
      this.generateViewPointMarker(viewPoint);
    })
  }

  @Input()
  public set dailyTrip(dailyTrip: IDailyTrip) {
    if (this._map === null) return;

    //Destroy first
    this.destroyTravelViewPointMarkers();

    this.generateDailyTripMarker(dailyTrip);
  }
  //#endregion Public property

  //#region Implements interface
  ngAfterViewInit(): void {
    this._map = new AMap.Map(this._mapElement.nativeElement, {});
    this.loadPlugin();
  }
  //#endregion Implements interface

  //#region Public method

  //#endregion Public method

  //#region Private method
  private loadPlugin() {
    AMap.plugin(['AMap.ToolBar', 'AMap.Geolocation'], () => {
      this._map.addControl(new AMap.ToolBar({ locate: false, position: "RB" }));
    });
  }

  //#region Destroy Marker
  private destroyViewPointMarkers() {
    this.destroyMarkers(false);
  }

  private destroyTravelViewPointMarkers() {
    this.destroyMarkers(true);
  }

  private destroyMarkers(isInTrip : boolean) {
    for (let [,value] of this._markers.entries()) {
      if (isInTrip == value.isInTrip) {
        this.destroyMarker(value.viewPoint)
      }
    }
  }

  private destroyMarker(viewPoint: IViewPoint) {
    if (this._markers.has(viewPoint.id)) {
      let vpInfor = this._markers.get(viewPoint.id);
      vpInfor.markerComponent.destroy();
      this._map.remove(vpInfor.marker);

      this._markers.delete(viewPoint.id);
    }
  }

  //#endregion

  //#regoin Generate Marker
  private generateViewPointMarker(viewPoint: IViewPoint) {
    this.generateMarker(viewPoint,false,-1);
  }

  private generateDailyTripMarker(dailyTrip : IDailyTrip) {
    for (let i = 0 ; i < dailyTrip.travelViewPoints.length ; i++)
      this.generateTravelViewPointMarker((<ITravelViewPoint>dailyTrip.travelViewPoints[i]).viewPoint,i);
  }

  private generateTravelViewPointMarker(viewPoint: IViewPoint,sequence : number) {
    this.generateMarker(viewPoint,true,sequence);
  }

  private generateMarker(viewPoint: IViewPoint, isInTrip : boolean, sequence : number) {
    if (!isInTrip) {
      if (this._markers.has(viewPoint.id) && this._markers.get(viewPoint.id).isInTrip) return;
    }

    this.destroyMarker(viewPoint);

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
    //   map: this._map
    // });
    // this._map.setZoomAndCenter(18,point);
    //#endregion
    
    marker.setExtData(viewPoint);
    crMarker.instance.viewPoint = viewPoint;
    crMarker.instance.isInTrip = isInTrip;
    crMarker.instance.sequence = sequence;
    crMarker.instance.detectChanges();

    this._markers.set(viewPoint.id, {
      marker: marker,
      markerComponent: crMarker,
      viewPoint: viewPoint,
      isInTrip: isInTrip
    });
  }
  //#endregion Private method  
}

export interface MarkerInfor {
  marker: AMap.Marker,
  markerComponent: ComponentRef<ViewPointMarkerComponent>,
  viewPoint: IViewPoint,
  isInTrip: boolean,
  //window: AMap.InfoWindow;
  //windowComponent: ComponentRef<InformationWindowComponent>;
}