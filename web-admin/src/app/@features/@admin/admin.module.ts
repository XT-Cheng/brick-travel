import { NgModule } from '@angular/core';

import { FileUploadModule } from '../../@core/fileUpload/fileUpload.module';
import { UIModule } from '../../@ui/ui.module';
import { AdminRoutingModule } from './admin-routing.module';
import { CityFormComponent } from './city/components/form/city.form.component';
import { CityListComponent } from './city/components/list/city.list.component';
import { AdminComponent } from './components/admin.component';
import { ModalComponent } from './components/modal.component';
import { ViewPointListComponent } from './viewPoint/components/list/viewPoint.list.component';
import { ViewPointFormComponent } from './viewPoint/components/form/viewPoint.form.component';

const ADMIN_COMPONENTS = [
  AdminComponent,
  CityListComponent,
  CityFormComponent,
  ViewPointFormComponent,
  ViewPointListComponent,
  ModalComponent
];

@NgModule({
  imports: [
    AdminRoutingModule,
    UIModule,
    FileUploadModule
  ],
  declarations: [
    ...ADMIN_COMPONENTS
  ],
  entryComponents: [CityFormComponent,ViewPointFormComponent,ModalComponent]
})
export class AdminModule {
}