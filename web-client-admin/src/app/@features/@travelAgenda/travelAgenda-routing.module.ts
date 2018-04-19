import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TravelAgendaSearchKeyResolver } from './providers/travelAgenda-searchKey-resolver';
import { TravelAgendaListComponent } from './components/list/travelAgenda.list.component';

const routes: Routes = [{
  path: '',
  component: TravelAgendaListComponent,
  resolve: { searchKey: TravelAgendaSearchKeyResolver }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TravelAgendaSearchKeyResolver]
})
export class TravelAgendaRoutingModule {
}
