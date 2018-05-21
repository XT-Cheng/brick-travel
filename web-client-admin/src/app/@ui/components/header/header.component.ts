import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';

import { IUserBiz } from '../../../@core/store/bizModel/model/user.biz.model';
import { UserService } from '../../../@core/store/providers/user.service';
import { SearchService } from '../../providers/search.service';

@Component({
  selector: 'bt-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @ViewChild('search', { read: ElementRef }) search: ElementRef;

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private _sidebarService: NbSidebarService,
    private _renderer: Renderer2,
    public _userService: UserService,
    private _searchService: SearchService,
    protected _router: Router) {
  }

  ngOnInit() {
    this._userService.loggedIn$
      .subscribe((user: IUserBiz) => {
        this.user = user;
      });

    this._searchService.onSearchSubmit().subscribe(({ term, tag }) => {
      if (term !== '') {
        this._renderer.addClass(this.search.nativeElement, 'markable');
      } else {
        this._renderer.removeClass(this.search.nativeElement, 'markable');
      }
    });
  }

  toggleSidebar(): boolean {
    this._sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this._sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }
}
