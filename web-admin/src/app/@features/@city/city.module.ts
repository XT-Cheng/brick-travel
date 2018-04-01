import { NgModule } from '@angular/core';

import { FileUploadModule } from 'shared/@core/fileUpload/fileUpload.module';
import { UIModule } from '../../@ui/ui.module';
import { CityFormComponent } from './components/form/city.form.component';
import { CityListComponent } from './components/list/city.list.component';
import { CityRoutingModule } from './city-routing.module';

const CITY_COMPONENTS = [
  CityListComponent,
  CityFormComponent
];

@NgModule({
  imports: [
    UIModule,
    FileUploadModule,
    CityRoutingModule
  ],
  declarations: [
    ...CITY_COMPONENTS
  ],
  entryComponents: [CityFormComponent]
})
export class CityModule {
}