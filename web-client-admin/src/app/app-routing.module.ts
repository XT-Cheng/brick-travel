import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './@ui/components/auth/auth.component';
import { LoginComponent } from './@ui/components/auth/login.component';
import { PageRoutingGuard } from './page-routing-guard';
import { PageComponent } from './page.component';
import { TestComponent } from './test.component';

const routes: Routes = [
  {
    path: 'pages', component: PageComponent, canActivate: [PageRoutingGuard], children: [
      { path: 'city', loadChildren: 'app/@features/@city/city.module#CityModule' },
      { path: 'viewPoint', loadChildren: 'app/@features/@viewPoint/viewPoint.module#ViewPointModule' },
      { path: 'travelAgenda', loadChildren: 'app/@features/@travelAgenda/travelAgenda.module#TravelAgendaModule' },
      { path: 'test', component: TestComponent },
      { path: '', redirectTo: 'travelAgenda', pathMatch: 'full' },
    ]
  },
  {
    path: 'auth', component: AuthComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
   useHash: false,
   enableTracing: false
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [PageRoutingGuard]
})
export class AppRoutingModule {
}
