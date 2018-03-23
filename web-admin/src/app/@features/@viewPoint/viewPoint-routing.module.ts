import { Routes, RouterModule } from "@angular/router";
import { ViewPointListComponent } from "./components/list/viewPoint.list.component";
import { ViewPointSearchKeyResolver } from "./providers/viewPoint-searchKey-resolver";
import { NgModule } from "@angular/core";
import { ViewPointCityResolver } from "./providers/viewPoint-city-resolver";

const routes: Routes = [{
          path: '',
          component: ViewPointListComponent,
          resolve: {searchKey: ViewPointSearchKeyResolver}
},{
  path: ':city',
  component: ViewPointListComponent,
  resolve:{
              searchKey: ViewPointSearchKeyResolver,
              city: ViewPointCityResolver
          }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ViewPointSearchKeyResolver,ViewPointCityResolver]
})
export class ViewPointRoutingModule {
}