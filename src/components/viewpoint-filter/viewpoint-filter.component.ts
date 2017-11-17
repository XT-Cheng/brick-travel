import { Component, AfterViewInit, ElementRef, Renderer2, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { IFilterCategory } from "../../modules/store/filterCategory/filterCategory.model";
import { IFilterCriteria } from "../../modules/store/filterCategory/filterCategory.model";

@Component({
  selector: 'viewpoint-filter',
  templateUrl: 'viewpoint-filter.component.html'
})
export class ViewPointFilterComponent implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Private property
  @ViewChild('grid') private _grid: ElementRef;
  //#endregion

  //#region Public property
  @Input() top: number;
  @Input() category: IFilterCategory;
  @Input() parent: any;
  //#endregion

  //#region Event
  @Output() filterSelected: EventEmitter<string> = new EventEmitter<string>();
  //#endregion

  //#region Constructor
  constructor(private cdRef: ChangeDetectorRef, private renderer: Renderer2) {
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    this.cdRef.detectChanges();

    this.renderer.setStyle(this._grid.nativeElement, 'top', this.top + 'px');
  }
  //#endregion

  //#region Protected methods
  protected getClass(criteria: IFilterCriteria) {
    return {
      'active': criteria.isChecked,
      'inactive': !criteria.isChecked
    }
  }

  protected backdropClicked() {
    this.parent.closeCurrentDropDown();
  }

  protected allCategoryClicked(event: any, allCriteria: IFilterCriteria) {
    if (allCriteria.isChecked) {
      this.refresh();
      event.stopPropagation();
      return;
    }

    allCriteria.isChecked = !allCriteria.isChecked;

    for (let criteria of this.category.criteries) {
      criteria.isChecked = false;
    }
    this.refresh();
    event.stopPropagation();
  }

  protected categoryClicked(event: any, criteria: IFilterCriteria) {
    criteria.isChecked = !criteria.isChecked;

    for (let c of this.category.criteries) {
      if (criteria.isChecked != c.isChecked) {
        this.category.allCriteria.isChecked = false;
        this.refresh();
        event.stopPropagation();
        return;
      }
    }

    this.category.allCriteria.isChecked = true;

    for (let c of this.category.criteries) {
      c.isChecked = false;
    }

    this.refresh();
    event.stopPropagation();
  }

  protected refresh() {
    if (this.category.allCriteria.isChecked) {
      this.category.label = this.category.allCriteria.name;
    }
    else {
      this.category.label = this.category.name;
    }

    this.parent.closeCurrentDropDown();
    this.filterSelected.emit(this.category.filter);
  }
  //#endregion
}
