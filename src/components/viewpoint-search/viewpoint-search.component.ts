import { AfterViewInit, ChangeDetectorRef, Component, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'viewpoint-search',
  templateUrl: 'viewpoint-search.component.html'
})
export class ViewPointSearchComponent implements AfterViewInit {
  //#region Private member

  //#endregion

  //#region Private property

  //#endregion

  //#region Public property
  @Input() public isVisible: boolean;
  //#endregion

  //#region Event
  
  //#endregion

  //#region Constructor
  constructor(private cdRef: ChangeDetectorRef, private renderer: Renderer2) {
  }
  //#endregion

  //#region Interface implementation
  ngAfterViewInit(): void {
    
  }
  //#endregion

  //#region Protected methods
  protected backdropClicked() {
    this.isVisible = false;
  }

  protected dismiss() {
    this.isVisible = false;
  }
  //#endregion
}
