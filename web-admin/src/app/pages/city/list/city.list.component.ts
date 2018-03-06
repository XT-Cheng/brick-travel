import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { SelectorService } from '../../../store/providers/selector.service';
import { CityService } from '../../../store/providers/city.service';
import { ComponentType } from '../../pages.component';
import { CityFormComponent } from '../form/city.form.component';

@Component({
  selector: 'bricktravel-city-list',
  templateUrl: 'city.list.component.html',
  styleUrls: ['./city.list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CityListComponent implements ComponentType{
  createComp: any = CityFormComponent;
  
  constructor(protected _selector : SelectorService,private _cityService : CityService) {
    this._cityService.load();
  }
}
