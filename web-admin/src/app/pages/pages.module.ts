import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ThemeModule } from '../@theme/theme.module';
import { CityFormComponent } from './components/city/form/city.form.component';
import { CityListComponent } from './components/city/list/city.list.component';
import { ModalComponent } from './components/modal.component';
import { PagesComponent } from './components/pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { FileUploadModule } from '../@core/fileUpload/fileUpload.module';

const PAGES_COMPONENTS = [
  PagesComponent,
  CityListComponent,
  CityFormComponent,
  ModalComponent
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    FormsModule,
    FileUploadModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  entryComponents: [CityFormComponent,ModalComponent]
})
export class PagesModule {
}
