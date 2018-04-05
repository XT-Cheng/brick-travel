import { ActivatedRoute, Router } from "@angular/router";
import { SelectorService } from "shared/@core/store/providers/selector.service";
import { Component } from '@angular/core';
import { ICityBiz } from "shared/@core/store/bizModel/city.biz.model";

@Component({
  selector: 'bt-test',
  template: `
    <bt-a-map style='display: inline;' [city]='city' [viewPoints]='selector.filterAndSearchedViewPoints$ | async'>
    </bt-a-map>
`
})
export class TestComponent {
  //#region Private members

  //#endregion

  //#region Public members
  city : ICityBiz;
  //#endregion

  //#region Interface implementation

  //#endregion

  //#region Constructor  

  constructor(private route: ActivatedRoute,
    private router: Router, public selector: SelectorService) {
      this.selector.cities$.subscribe(cities => {
        this.city = cities[0];
      })
  }

  //#endregion

  //#region Pubic methods
 
//#endregion
}