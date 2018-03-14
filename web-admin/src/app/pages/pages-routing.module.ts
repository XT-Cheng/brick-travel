import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './components/pages.component';
import { CityListComponent } from './components/city/list/city.list.component';
import { RoutingGuard } from './pages-routing-guard';
import { CityResolver } from './providers/city-resolver';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate: [RoutingGuard],
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
  providers: [RoutingGuard,CityResolver]
})
export class PagesRoutingModule {
}
