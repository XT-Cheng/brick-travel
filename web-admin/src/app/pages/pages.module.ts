import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { PagesComponent } from './components/pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { CityListComponent } from './components/city/list/city.list.component';
import { CityFormComponent } from './components/city/form/city.form.component';
import { ModalComponent } from './components/modal.component';
import { FileDropDirective } from './directives/file-drop.directive';
import { FileSelectDirective } from './directives/file-select.directive';

const PAGES_COMPONENTS = [
  PagesComponent,
  CityListComponent,
  CityFormComponent,
  ModalComponent,
  FileSelectDirective,
  FileDropDirective
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
  entryComponents: [CityFormComponent,ModalComponent]
})
export class PagesModule {
}
