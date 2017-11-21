import { Searchbar } from 'ionic-angular';
import { AfterViewInit, Component, ElementRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'viewpoint-search',
  templateUrl: 'viewpoint-search.component.html'
})
export class ViewPointSearchComponent implements AfterViewInit {
  //#region Private member

  @ViewChild('searchBar') private _searchBar: Searchbar;

  //#endregion

  //#region Protected member

  protected searchKey: string;

  //#endregion

  //#region Private property
  @Output() protected backGroundClicked: EventEmitter<void>;

  //#endregion

  //#region Public property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor() {
    this.backGroundClicked = new EventEmitter();
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    this._searchBar.setFocus();
  }
  //#endregion

  //#region Protected methods
  protected dismiss(): void {
    this.backGroundClicked.emit();
  }

  protected search($event): void {
    console.log(this.searchKey);
  }
  //#endregion
}
