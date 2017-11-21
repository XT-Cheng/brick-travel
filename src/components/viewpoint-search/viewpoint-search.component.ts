import { Searchbar } from 'ionic-angular';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'viewpoint-search',
  templateUrl: 'viewpoint-search.component.html'
})
export class ViewPointSearchComponent implements AfterViewInit {
  //#region Private member
  private _isVisible : boolean;
  //#endregion

  //#region Private property
  @ViewChild('searchBar') private _searchBar : Searchbar;
  @ViewChild('template') private _tempalate : ElementRef;
  
  //#endregion

  //#region Public property
  @Input() public set isVisible(isVisible : boolean) {
    this._isVisible = isVisible;

    // if (this._isVisible)
    //   this._searchBar.setFocus();
  }

  public get isVisible() : boolean {
    return this._isVisible;
  }
  //#endregion

  //#region Event
  
  //#endregion

  //#region Constructor
  constructor() {
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    console.log(this._searchBar);
  }
  //#endregion

  //#region Protected methods
  protected dismiss() : void {
    this.isVisible = false;
  }

  protected search($event) : void {
    console.log('Search!!!');
  }
  //#endregion
}
