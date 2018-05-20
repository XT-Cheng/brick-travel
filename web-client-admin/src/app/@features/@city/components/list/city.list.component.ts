import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { filter } from 'rxjs/operators';

import { ICityBiz, newCity } from '../../../../@core/store/bizModel/model/city.biz.model';
import { ICity } from '../../../../@core/store/entity/model/city.model';
import { CityService } from '../../../../@core/store/providers/city.service';
import { CityUIService } from '../../../../@core/store/providers/city.ui.service';
import { ErrorService } from '../../../../@core/store/providers/error.service';
import { SearchService } from '../../../../@ui/providers/search.service';
import { EntityListComponent } from '../../../entity.list.component';
import { CityFormComponent } from '../form/city.form.component';

@Component({
  selector: 'bt-city-list',
  templateUrl: 'city.list.component.html',
  styleUrls: ['./city.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityListComponent extends EntityListComponent<ICity, ICityBiz> {
  //#region Private members

  //#endregion

  //#region Constructor
  constructor(protected _route: ActivatedRoute, protected _cityUIService: CityUIService,
    protected _errorService: ErrorService,
    protected _searchService: SearchService, protected _modalService: NgbModal, protected _cityService: CityService,
    protected _toasterService: ToasterService) {
    super(_route, _cityUIService, _errorService, _searchService, _modalService, _cityService, _toasterService);
  }
  //#endregion

  //#region Interface implementation
  protected get componentType(): any {
    return CityFormComponent;
  }

  protected get newEntity(): ICityBiz {
    return newCity();
  }

  protected get entityType(): string {
    return 'City';
  }

  //#endregion

  //#region Public method
  edit(city: ICityBiz) {
    this.editEntity(city, city.name);
  }

  delete(city: ICityBiz) {
    this.deleteEntity(city, city.name);
    this._cityService.all$.pipe(
      filter((cities) => {
        return !cities.some((value) => value.id === city.id);
      })
    ).subscribe(() => this._toasterService.pop('success', 'Success', `City ${city.name} deleted`));
  }

  // this._cityService.deleteCity(city).subscribe((ret: Error | ICityBiz) => {
  //   if (ret instanceof Error) {
  //     this.toasterService.pop('error', 'Error', `Can't delete city, pls try later`);
  //   } else {
  //     this.toasterService.pop('success', 'Success', `City ${city.name} deleted`);
  //   }
  // });
  //#endregion
}
