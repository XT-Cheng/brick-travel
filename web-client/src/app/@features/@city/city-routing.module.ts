import { Routes, RouterModule } from "@angular/router";
import { CityListComponent } from "./components/list/city.list.component";
import { CityResolver } from "./providers/city-resolver";
import { NgModule } from "@angular/core";

const routes: Routes = [{
          path: '',
          component: CityListComponent,
          resolve: {searchKey: CityResolver}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CityResolver]
})
export class CityRoutingModule {
}