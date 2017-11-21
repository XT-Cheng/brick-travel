import { NgRedux } from '@angular-redux/store';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IFilterCategory } from '../../modules/store/entity/filterCategory/filterCategory.model';
import { IFilterCriteria } from '../../modules/store/entity/filterCategory/filterCategory.model';
import { getFilterCategories } from '../../modules/store/entity/filterCategory/filterCategory.selector';
import { IAppState } from '../../modules/store/store.model';

@Component({
  selector: 'viewpoint-filter',
  templateUrl: 'viewpoint-filter.component.html'
})
export class ViewPointFilterComponent implements AfterViewInit {
  //#region Private member
  
  //#endregion

  //#region Protected member
  
  protected filterCategories$: Observable<Array<IFilterCategory>>;
  protected _currentCategory : IFilterCategory = null; 
  
  //#endregion

  //#region Private property
  
  // @ViewChild('grid') private _grid: ElementRef;
  //#endregion

  //#region Public property
  @Input() public isVisible: boolean;
  //#endregion

  //#region Event
  
  //#endregion

  //#region Constructor
  constructor(private _store: NgRedux<IAppState>) {
    this.filterCategories$ = this._store.select<{ [id: string]: IFilterCategory }>(['entities', 'filterCategories']).map(getFilterCategories(this._store));
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
  }
  //#endregion

  //#region Protected methods
  protected dismiss() {
    this._currentCategory = null;
    this.isVisible = false;
  }

  protected getClass(criteria: IFilterCriteria) {
    return {
      'active': criteria.isChecked,
      'inactive': !criteria.isChecked
    }
  }

  protected allCategoryClicked(event: any) {
    if (this._currentCategory.allCriteria.isChecked) {
      this.refresh();
      event.stopPropagation();
      return;
    }

    this._currentCategory.allCriteria.isChecked = !this._currentCategory.allCriteria.isChecked;

    for (let criteria of this._currentCategory.criteries) {
      criteria.isChecked = false;
    }
    this.refresh();
    event.stopPropagation();
  }

  protected categoryClicked(event: any, criteria: IFilterCriteria) {
    criteria.isChecked = !criteria.isChecked;

    for (let c of this._currentCategory.criteries) {
      if (criteria.isChecked != c.isChecked) {
        this._currentCategory.allCriteria.isChecked = false;
        this.refresh();
        event.stopPropagation();
        return;
      }
    }

    this._currentCategory.allCriteria.isChecked = true;

    for (let c of this._currentCategory.criteries) {
      c.isChecked = false;
    }

    this.refresh();
    event.stopPropagation();
  }

  protected clicked($event, category) {
    this._currentCategory = category;
  }

  protected refresh() {
    if (this._currentCategory.allCriteria.isChecked) {
      this._currentCategory.label = this._currentCategory.allCriteria.name;
    }
    else {
      this._currentCategory.label = this._currentCategory.name;
    }
  }
  //#endregion
}
