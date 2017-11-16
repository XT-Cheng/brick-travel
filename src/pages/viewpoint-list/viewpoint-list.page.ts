import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, ViewContainerRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { ViewPointService } from "../../providers/view-point.service";
import 'rxjs/Rx';
import { NavController, NavParams } from "ionic-angular";
import { City } from "../../data-model/city.model";
import { FilterCategory } from "../../data-model/filter-category.model";
import { Content } from "ionic-angular";
import { ViewpointFilterComponent } from "../../components/viewpoint-filter/viewpoint-filter.component";
import { ViewpointListComponent } from "../../components/viewpoint-list/viewpoint-list.component";
import { FilterCateogryService } from "../../providers/filter-cateogry.service";
import { AMapComponent } from "../../components/map-related/a-map/a-map.component";
import { ViewPoint } from "../../data-model/view-point.model";
import { ViewpointDetailPage } from "../viewpoint-detail/viewpoint-detail.page";
import { Subscription } from "rxjs/Subscription";
import { TravelAgenda, DailyTrip } from "../../data-model/travel-agenda.model";

@Component({
  selector: 'page-viewpoint-list',
  templateUrl: 'viewpoint-list.page.html'
})
export class ViewpointListPage implements OnDestroy, AfterViewInit {
  @ViewChild('header') private headerElement: ElementRef;
  @ViewChild(AMapComponent) private map: AMapComponent;
  @ViewChild(ViewpointListComponent) private viewpointList: ViewpointListComponent;
  @ViewChild('dropdown', { read: ViewContainerRef }) private dropdownContainer: ViewContainerRef;
  @ViewChild(Content) content: Content;

  private viewpointFilterComponentFactory: ComponentFactory<ViewpointFilterComponent>;
  private currentDropDown: ViewpointFilterComponent;
  private city: City;
  private subscriptions: Array<Subscription> = new Array<Subscription>();

  protected categories: Array<FilterCategory> = new Array<FilterCategory>();
  protected mode: string = 'map';

  constructor(private resolver: ComponentFactoryResolver, private nav: NavController, private navParams: NavParams,
    private filterCategoryService: FilterCateogryService, private viewPointService: ViewPointService) {
    this.viewpointFilterComponentFactory = this.resolver.resolveComponentFactory(ViewpointFilterComponent);
    this.city = this.navParams.get('city');
    
    this.subscriptions.push(this.viewPointService.viewPoints.subscribe((ret) => {
      let viewPoints = ret.viewPoints;
      let append = ret.append;

      if (append) {
        this.viewpointList.addViewPoints(ret.viewPoints);
      }
      else {
        if (viewPoints.length === 0)
          this.map.setCity(this.city.name);

        this.map.viewPoints = viewPoints;
        this.map.travelViewPoints =(<DailyTrip>this.navParams.get('dailyTrip')).travelViewPoints;
        this.viewpointList.viewPoints = viewPoints;
        this.viewpointList.travelViewPoints=(<DailyTrip>this.navParams.get('dailyTrip')).travelViewPoints;
        this.viewpointList.viewMode = this.map.viewMode = this.navParams.get('viewMode');
      }
    }));

    this.subscriptions.push(this.filterCategoryService.filterCategories.subscribe((categories) => {
      if (categories === null) return;

      this.categories = categories;
      this.content.resize();
    }));
  }

  ngAfterViewInit(): void {    
    this.viewPointService.getViewPoints(this.city);
    this.filterCategoryService.getFilterCategories();
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions)
      sub.unsubscribe();
  }

  protected showMap() {
    return { 'display': this.mode === 'map' ? 'block' : 'none' };
  }

  protected showList() {
    return { 'display': this.mode === 'list' ? 'block' : 'none' };
  }

  protected listSelected() {
    this.mode = 'list';
  }

  protected mapSelected() {
    this.mode = 'map';
  }

  protected getListButtonColor() {
    return (this.mode ==='list')?'danger':'primary';
  }

  protected getMapButtonColor() {
    return (this.mode ==='list')?'primary':'danger';
  }

  protected getColor(category) {
    if (category.allCriteria.isChecked)
      return "primary";
    else
      return "secondary";
  }

  protected closeCurrentDropDown() {
    if (this.currentDropDown != null) {
      this.dropdownContainer.detach();
      this.currentDropDown = null;
    }
  }

  protected clicked($event, category) {
    this.closeCurrentDropDown();

    let p = this.dropdownContainer.createComponent(this.viewpointFilterComponentFactory);

    this.currentDropDown = p.instance;
    this.currentDropDown.category = category;
    this.currentDropDown.parent = this;
    this.currentDropDown.top = this.headerElement.nativeElement.clientHeight;
    this.currentDropDown.filterSelected.subscribe((filter) => {
      this.viewPointService.getViewPoints(null, 0, filter);
    });

    this.currentDropDown.ngAfterViewInit();

    $event.stopPropagation();
  }

  protected fetchMore(count: number) {
    this.viewPointService.getViewPoints(null, count);
  }

  protected viewPointClicked(viewPoint: ViewPoint) {
    this.nav.push(ViewpointDetailPage, { 'viewPoint': viewPoint });
  }
}
