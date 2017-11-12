import { Component, AfterViewInit, ViewChild, ElementRef, ComponentFactory, ComponentRef, Input, ComponentFactoryResolver, Injector } from "@angular/core";
import { ViewPointMarkerComponent } from "./viewpoint-marker/viewpoint-marker.component";
import { IViewPoint } from "../../modules/store/viewPoint/model";

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

    //Destroy first
    this.destroyViewPointMarkers();

    for (let viewPoint of viewPoints)
      this.generateViewPointMarker(viewPoint);
  }
  //#endregion Public property

  //#region Implements interface
  ngAfterViewInit(): void {
    this._map = new AMap.Map(this._mapElement.nativeElement, {

    });

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

  private destroyViewPointMarkers() {
    const values = this._markers.values();
    for (let value of Array.from(values)) {
      this.destroyViewPointMarker(value.viewPoint)
    }

    this._map.clearInfoWindow();

    this._markers.clear();
  }

  private destroyViewPointMarker(viewPoint: IViewPoint) {
    if (this._markers.has(viewPoint.id)) {
      let vpInfor = this._markers.get(viewPoint.id);
      vpInfor.markerComponent.destroy();
      this._map.remove(vpInfor.marker);

      this._markers.delete(viewPoint.id);
    }
  }

  private generateViewPointMarker(viewPoint: IViewPoint) {
    this.destroyViewPointMarker(viewPoint);

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
    new AMap.Marker({
      position: point,
      offset: new AMap.Pixel(0, 0),
      map: this._map
    });
    this._map.setZoomAndCenter(18,point);
    //#endregion
    
    marker.setExtData(viewPoint);
    crMarker.instance.viewPoint = viewPoint;
    crMarker.instance.detectChanges();

    this._markers.set(viewPoint.id, {
      marker: marker,
      markerComponent: crMarker,
      viewPoint: viewPoint
    });
  }
  //#endregion Private method  
}

export interface MarkerInfor {
  marker: AMap.Marker;
  markerComponent: ComponentRef<ViewPointMarkerComponent>;
  viewPoint: IViewPoint
  //window: AMap.InfoWindow;
  //windowComponent: ComponentRef<InformationWindowComponent>;
}