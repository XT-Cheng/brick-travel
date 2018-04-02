import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbCardModule,
  NbCheckboxModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbContextMenuModule,
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule } from 'angular2-toaster';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { SearchComponent } from './components/search-input/search.component';
import { TwoColumnsLayoutComponent } from './layouts/two-columns/two-columns.layout';
import { CapitalizePipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';
import { SearchService } from './providers/search.service';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DEFAULT_THEME } from './styles/theme.default';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ModalComponent } from './components/modal/modal.component';
import { LoginComponent } from './components/auth/login.component';
import { RouterModule } from '@angular/router';
import { NbAuthModule } from '@nebular/auth';
import { AuthComponent } from './components/auth/auth.component';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule,RouterModule];

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
  NbAuthModule,
  ToasterModule
];

const COMPONENTS = [
  AuthComponent,
  LoginComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  SearchComponent,
  TwoColumnsLayoutComponent,
  ModalComponent,
  AutofocusDirective
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

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [SearchInputComponent,ModalComponent,LoginComponent,AuthComponent]
})
export class UIModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: UIModule,
      providers: [...PROVIDERS],
    };
  }
}
