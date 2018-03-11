import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './components/pages.component';
import { CityListComponent } from './components/city/list/city.list.component';
import { RoutingGuard } from './pages-routing-guard';

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
  providers: [RoutingGuard]
})
export class PagesRoutingModule {
}
