import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { SelectorService } from '../../../@core/store/providers/selector.service';
import { IUserBiz } from '../../../@core/store/bizModel/user.biz.model';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    public selectorService: SelectorService,
    protected router: Router) {
  }

  ngOnInit() {
    this.selectorService.userLoggedIn$
      .subscribe((user: IUserBiz) => this.user = user);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.router.navigateByUrl('noexsit/1/2');
  }
}
