import { Component } from '@angular/core';

export interface ComponentType {
  createEntity();
}

export enum EntityFormMode {
  create,
  edit
}

@Component({
  selector: 'ngx-app',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: [`./app.component.scss`]
})
export class AppComponent {
}
