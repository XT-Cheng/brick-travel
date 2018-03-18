import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminComponent } from './components/admin.component';
import { CityListComponent } from './city/components/list/city.list.component';
import { AdminRoutingGuard } from './admin-routing-guard';
import { CityResolver } from './city/providers/city-resolver';
import { ViewPointListComponent } from './viewPoint/components/list/viewPoint.list.component';
import { ViewPointResolver } from './viewPoint/providers/viewPoint-resolver';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  canActivate: [AdminRoutingGuard],
  children: [
    {
      path: '',
      children: [
        {
          path: 'city',
          component: CityListComponent,
          resolve: {searchKey: CityResolver}
        },
        {
          path: 'viewPoint',
          component: ViewPointListComponent,
          resolve: {searchKey: ViewPointResolver}
        },
        {
          path: '',
          redirectTo: 'city',
          pathMatch: 'full',
        }
      ]
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AdminRoutingGuard,CityResolver,ViewPointResolver]
})
export class AdminRoutingModule {
}