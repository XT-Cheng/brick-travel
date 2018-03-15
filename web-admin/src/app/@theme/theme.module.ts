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
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent, HeaderComponent, SearchInputComponent } from './components';
import { SearchComponent } from './components/search-input/search.component';
import { TwoColumnsLayoutComponent } from './layouts';
import { CapitalizePipe, PluralPipe, RoundPipe, TimingPipe } from './pipes';
import { SearchService } from './providers/search.service';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DEFAULT_THEME } from './styles/theme.default';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const CORE_MODULES = [];

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
  NgbModule,
];

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  SearchComponent,
  TwoColumnsLayoutComponent,
];

const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
    },
    [DEFAULT_THEME, COSMIC_THEME],
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  SearchService
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES,...CORE_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [SearchInputComponent]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}
