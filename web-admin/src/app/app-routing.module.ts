import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { RoutingGuard } from './app-routing-guard';

const routes: Routes = [
  { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule' ,canActivate: [RoutingGuard]},
  { path: '', redirectTo: 'pages', pathMatch: 'full',canActivate: [RoutingGuard] },
  { path: '**', redirectTo: 'pages', canActivate: [RoutingGuard] },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [RoutingGuard]
})
export class AppRoutingModule {
}
