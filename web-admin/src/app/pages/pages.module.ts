import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { CityListComponent } from './city/list/city.list.component';
import { CityFormComponent } from './city/form/city.form.component';

const PAGES_COMPONENTS = [
  PagesComponent,
  CityListComponent,
  CityFormComponent
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    FormsModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  entryComponents: [CityFormComponent]
})
export class PagesModule {
}
