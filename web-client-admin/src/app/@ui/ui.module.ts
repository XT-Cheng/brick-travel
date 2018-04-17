import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule } from 'angular2-toaster';

import { AMapComponent } from './components/a-map/a-map.component';
import { InformationWindowComponent } from './components/a-map/information-window/information-window.component';
import { RateComponent } from './components/a-map/rate/rate.component';
import { ViewPointMarkerComponent } from './components/a-map/viewpoint-marker/viewpoint-marker.component';
import { AuthBlockComponent } from './components/auth/auth-block.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchComponent } from './components/search-input/search.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { TwoColumnsLayoutComponent } from './layouts/two-columns/two-columns.layout';
import { CapitalizePipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';
import { SearchService } from './providers/search.service';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DEFAULT_THEME } from './styles/theme.default';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NgbModule,
  ToasterModule
];

const COMPONENTS = [
  AuthBlockComponent,
  AuthComponent,
  LoginComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  SearchComponent,
  TwoColumnsLayoutComponent,
  ModalComponent,
  AutofocusDirective,
  AMapComponent,
  InformationWindowComponent,
  RateComponent,
  ViewPointMarkerComponent
];

const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
];

const PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
    },
    [DEFAULT_THEME, COSMIC_THEME],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  ...ToasterModule.forRoot().providers,
  SearchService
];

const ENTRY_COMPONENTS = [
  AMapComponent,
  InformationWindowComponent,
  ViewPointMarkerComponent,
  SearchInputComponent, 
  ModalComponent, 
  LoginComponent, 
  AuthComponent
]

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class UIModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: UIModule,
      providers: [...PROVIDERS],
    };
  }
}
