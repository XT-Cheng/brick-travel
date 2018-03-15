import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { RoutingGuard } from './app-routing-guard';

const routes: Routes = [
  { path: 'admin', loadChildren: 'app/@features/@admin/admin.module#AdminModule' ,canActivate: [RoutingGuard]},
  { path: '', redirectTo: 'admin', pathMatch: 'full',canActivate: [RoutingGuard] },
  { path: '**', redirectTo: 'admin', canActivate: [RoutingGuard] },
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
