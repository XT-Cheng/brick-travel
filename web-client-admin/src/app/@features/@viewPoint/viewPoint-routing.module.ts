import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewPointListComponent } from './components/list/viewPoint.list.component';
import { ViewPointCityResolver } from './providers/viewPoint-city-resolver';
import { ViewPointSearchKeyResolver } from './providers/viewPoint-searchKey-resolver';

const routes: Routes = [{
  path: '',
  component: ViewPointListComponent,
  resolve: { searchKey: ViewPointSearchKeyResolver }
}, {
  path: ':city',
  component: ViewPointListComponent,
  resolve: {
    searchKey: ViewPointSearchKeyResolver,
    city: ViewPointCityResolver
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ViewPointSearchKeyResolver, ViewPointCityResolver]
})
export class ViewPointRoutingModule {
}
