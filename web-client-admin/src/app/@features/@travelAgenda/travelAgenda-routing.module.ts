import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TravelAgendaListComponent } from './components/list/travelAgenda.list.component';

const routes: Routes = [{
  path: '',
  component: TravelAgendaListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelAgendaRoutingModule {
}
