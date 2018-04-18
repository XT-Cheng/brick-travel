import { Component } from '@angular/core';

// TODO: move layouts into the framework
@Component({
  selector: 'bt-two-columns-layout',
  styleUrls: ['./two-columns.layout.scss'],
  template: `
    <nb-layout [withScroll]='true'>
      <nb-layout-header fixed>
        <bt-header></bt-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive >
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="ext-small">
        <ng-content></ng-content>
      </nb-layout-column>

      <nb-layout-column left>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

    </nb-layout>
  `,
})
export class TwoColumnsLayoutComponent {
}
