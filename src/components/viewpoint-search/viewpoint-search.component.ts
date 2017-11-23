import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Searchbar } from 'ionic-angular';

import { UIActionGenerator } from '../../modules/store/ui/ui.action';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../modules/store/store.model';

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

  //#region Protected property

  @Output() protected backGroundClicked$: EventEmitter<void>;

  //#endregion

  //#region Public property

  //#endregion

  //#region Event

  //#endregion

  //#region Constructor
  constructor(private _uiActionGenerator : UIActionGenerator,private _store: NgRedux<IAppState>) {
    this.backGroundClicked$ = new EventEmitter();
    this.searchKey = this._store.getState().ui.viewPoint.searchKey;
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
    this.backGroundClicked$.emit();
  }

  protected search($event): void {
    this._uiActionGenerator.searchViewPoint(this.searchKey);
  }
  //#endregion
}
