import { Routes, RouterModule } from "@angular/router";
import { ViewPointListComponent } from "./components/list/viewPoint.list.component";
import { ViewPointResolver } from "./providers/viewPoint-resolver";
import { NgModule } from "@angular/core";

const routes: Routes = [{
          path: '',
          component: ViewPointListComponent,
          resolve: {searchKey: ViewPointResolver}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ViewPointResolver]
})
export class ViewPointRoutingModule {
}