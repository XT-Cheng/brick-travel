import { NgModule } from '@angular/core';

import { FileUploadModule } from 'shared/@core/fileUpload/fileUpload.module';
import { UIModule } from '../../@ui/ui.module';
import { ViewPointFormComponent } from './components/form/viewPoint.form.component';
import { ViewPointListComponent } from './components/list/viewPoint.list.component';
import { ViewPointRoutingModule } from './viewPoint-routing.module';

const VIEWPOINT_COMPONENTS = [
  ViewPointListComponent,
  ViewPointFormComponent
];

@NgModule({
  imports: [
    UIModule,
    FileUploadModule,
    ViewPointRoutingModule
  ],
  declarations: [
    ...VIEWPOINT_COMPONENTS
  ],
  entryComponents: [ViewPointFormComponent]
})
export class ViewPointModule {
}