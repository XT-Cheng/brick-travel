import { AfterViewInit, Component, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { Searchbar } from 'ionic-angular';

@Component({
  selector: 'viewpoint-search',
  templateUrl: 'viewpoint-search.component.html'
})
export class ViewPointSearchComponent implements AfterViewInit {
  //#region Private member

  @ViewChild('searchBar') private _searchBar: Searchbar;

  //#endregion

  //#region Protected member
  
  //#endregion

  //#region Protected property
  @Input() protected searchKey : string;
  
  @Output() protected backGroundClickedEvent: EventEmitter<void>;
  @Output() protected searchEvent : EventEmitter<string>;

  //#endregion

  //#region Public property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor() {
    this.backGroundClickedEvent = new EventEmitter();
    this.searchEvent = new EventEmitter();
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    setTimeout(()=> {
      this._searchBar.setFocus();      
    });
  }
  //#endregion

  //#region Protected methods
  protected backGroundClicked(): void {
    this.backGroundClickedEvent.emit();
  }

  protected search($event): void {
    this.searchEvent.emit(this._searchBar.value);
  }
  //#endregion
}
