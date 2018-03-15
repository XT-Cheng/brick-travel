import { NgModule } from '@angular/core';

import { FileUploadModule } from '../../@core/fileUpload/fileUpload.module';
import { UIModule } from '../../@ui/ui.module';
import { AdminRoutingModule } from './admin-routing.module';
import { CityFormComponent } from './city/components/form/city.form.component';
import { CityListComponent } from './city/components/list/city.list.component';
import { AdminComponent } from './components/admin.component';
import { ModalComponent } from './components/modal.component';

const ADMIN_COMPONENTS = [
  AdminComponent,
  CityListComponent,
  CityFormComponent,
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
  entryComponents: [CityFormComponent,ModalComponent]
})
export class AdminModule {
}