import { Component, Input, OnInit, ViewRef, ViewChild, AfterViewInit, ElementRef, ViewContainerRef, Renderer2 } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { SelectorService } from '../../../shared/@core/store/providers/selector.service';
import { IUserBiz } from '../../../shared/@core/store/bizModel/user.biz.model';
import { Router } from '@angular/router';
import { SearchService } from '../../providers/search.service';

@Component({
  selector: 'bt-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  
  @ViewChild('search',{read: ElementRef}) search : ElementRef

  @Input() position = 'normal';

  user: any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private renderer : Renderer2,
    private searchService : SearchService,
    public selectorService: SelectorService,
    protected router: Router) {
  }

  ngOnInit() {
    this.selectorService.userLoggedIn$
      .subscribe((user: IUserBiz) =>{
        this.user = user
      });

    this.searchService.onSearchSubmit().subscribe(({term,tag}) => {
      if (term != '') {
        this.renderer.addClass(this.search.nativeElement,'markable');
      }
      else {
        this.renderer.removeClass(this.search.nativeElement,'markable');
      }
    });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }
}
