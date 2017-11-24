import { NgRedux } from '@angular-redux/store';
import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IFilterCategory } from '../../modules/store/entity/filterCategory/filterCategory.model';
import { IFilterCriteria } from '../../modules/store/entity/filterCategory/filterCategory.model';
import { IAppState } from '../../modules/store/store.model';
import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { getCurrentFilters } from '../../modules/store/ui/ui.selector';

@Component({
  selector: 'viewpoint-filter',
  templateUrl: 'viewpoint-filter.component.html'
})
export class ViewPointFilterComponent implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Protected member

  protected currentFilterCategories$: Observable<Array<IFilterCategory>>;
  protected selectedCategory: IFilterCategory = null;

  //protected selectedCriteries : Array<IFilterCriteria> = new Array<IFilterCriteria>();

  //#endregion

  //#region Protected property

  @Output() protected backGroundClicked$: EventEmitter<void>;

  //#endregion

  //#region Public property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor(private _uiActionGenerator: UIActionGenerator, private _store: NgRedux<IAppState>) {
    this.backGroundClicked$ = new EventEmitter();
    this.currentFilterCategories$ = this._store.select<string[]>(['ui', 'viewPoint', 'filters'])
      .map(getCurrentFilters(this._store));
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
  }
  //#endregion

  //#region Protected methods
  protected backGroundClicked(): void {
    this.backGroundClicked$.emit();
  }

  protected getCriteriaClass(criteria: IFilterCriteria) {
    return {
      'active': criteria.isChecked,
      'inactive': !criteria.isChecked
    }
  }

  protected getCategoryClass(category: IFilterCategory) {
    let hasCheckedCriteria = category.criteries.some(criteria => {
      return criteria.isChecked
    });

    return {
      'active': hasCheckedCriteria,
      'inactive': !hasCheckedCriteria
    }
  }

  protected criteriaClicked(event: any, criteria: IFilterCriteria) {
    criteria.isChecked = !criteria.isChecked;

    if (!this.selectedCategory.criteries.find(c => !c.isChecked)) {
      this.selectedCategory.criteries.forEach(c => {
        c.isChecked = false;
      })
    }

    this.execUIAction();
  }

  protected clicked($event, category) {
    this.selectedCategory = category;
  }

  //#endregion

  //#region Private methods
  private execUIAction() {
    let checkId : string = null;
    let unCheckIds : Array<string> = new Array<string>();

    this.selectedCategory.criteries.forEach(c => {
      if (c.isChecked)
        checkId = c.id;
      else
        unCheckIds.push(c.id);
    });

    this._uiActionGenerator.selectCriteria(checkId,unCheckIds);
  }
  //#endregion
}
