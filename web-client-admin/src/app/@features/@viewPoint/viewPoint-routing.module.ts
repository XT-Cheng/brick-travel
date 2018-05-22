import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewPointListComponent } from './components/list/viewPoint.list.component';

const routes: Routes = [{
  path: '',
  component: ViewPointListComponent
}, {
  path: ':city',
  component: ViewPointListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewPointRoutingModule {
}
