import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { IFilterCategoryBiz, IFilterCriteriaBiz } from '../../bizModel/model/filterCategory.biz.model';

@Component({
  selector: 'viewpoint-filter',
  templateUrl: 'viewpoint-filter.component.html'
})
export class ViewPointFilterComponent implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Protected member

  protected selectedCategory: IFilterCategoryBiz = null;
  @Input() protected filterCategories : Array<IFilterCategoryBiz>;
  
  //#endregion

  //#region Protected property

  @Output() protected backGroundClickedEvent: EventEmitter<void>;
  @Output() protected criteriaClickedEvent: EventEmitter<{category: IFilterCategoryBiz, criteria: IFilterCriteriaBiz}>;
  
  //#endregion

  //#region Public property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor() {
    this.backGroundClickedEvent = new EventEmitter();
    this.criteriaClickedEvent = new EventEmitter();
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
  }
  //#endregion

  //#region Protected methods
  protected backGroundClicked(): void {
    this.backGroundClickedEvent.emit();
  }

  protected getCriteriaClass(criteria: IFilterCriteriaBiz) {
    return {
      'active': criteria.isChecked,
      'inactive': !criteria.isChecked
    }
  }

  protected getCategoryClass(category: IFilterCategoryBiz) {
    let hasCheckedCriteria = category.criteries.some(criteria => {
      return criteria.isChecked
    });

    return {
      'active': hasCheckedCriteria,
      'inactive': !hasCheckedCriteria
    }
  }

  protected criteriaClicked(event: any, criteria: IFilterCriteriaBiz) {
    this.criteriaClickedEvent.emit({category: this.selectedCategory,criteria: criteria});
  }

  protected clicked($event, category) {
    this.selectedCategory = category;
  }

  //#endregion

  //#region Private methods
  
  //#endregion
}
