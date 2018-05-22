import { Routes, RouterModule } from '@angular/router';
import { CityListComponent } from './components/list/city.list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{
          path: '',
          component: CityListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule {
}
