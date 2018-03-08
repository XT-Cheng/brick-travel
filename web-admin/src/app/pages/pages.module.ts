import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { CityListComponent } from './city/list/city.list.component';
import { CityFormComponent } from './city/form/city.form.component';
import { ModalComponent } from './modal.component';
import { FileUploadModule } from 'ng2-file-upload';

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
    FileUploadModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  entryComponents: [CityFormComponent,ModalComponent]
})
export class PagesModule {
}
