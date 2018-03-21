import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { AppRoutingGuard } from './app-routing-guard';
import { CityListComponent } from './@features/@city/components/list/city.list.component';
import { PageComponent } from './page.component';
import { PageRoutingGuard } from './page-routing-guard';

const routes: Routes = [
  { path: 'pages', component: PageComponent, canActivate: [PageRoutingGuard,AppRoutingGuard], children: [
    { path: 'city', loadChildren: 'app/@features/@city/city.module#CityModule'},
    { path: 'viewPoint', loadChildren: 'app/@features/@viewPoint/viewPoint.module#ViewPointModule'},  
    { path: '', redirectTo: 'city', pathMatch: 'full'},
  ]},
  { path: '', redirectTo: 'pages', pathMatch: 'full'},
  { path: '**', redirectTo: 'pages'},
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [AppRoutingGuard]
})
export class AppRoutingModule {
}
