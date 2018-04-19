import { NgModule } from '@angular/core';

import { FileUploadModule } from '../../@core/fileUpload/fileUpload.module';
import { UIModule } from '../../@ui/ui.module';
import { TravelAgendaListComponent } from './components/list/travelAgenda.list.component';
import { TravelAgendaRoutingModule } from './travelAgenda-routing.module';

const TRAVELAGENDA_COMPONENTS = [
  TravelAgendaListComponent
];

@NgModule({
  imports: [
    UIModule,
    FileUploadModule,
    TravelAgendaRoutingModule
  ],
  declarations: [
    ...TRAVELAGENDA_COMPONENTS
  ],
  entryComponents: [TravelAgendaListComponent]
})
export class TravelAgendaModule {
}
