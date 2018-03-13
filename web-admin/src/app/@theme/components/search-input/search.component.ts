/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { filter } from 'rxjs/operators/filter';
import { of as observableOf } from 'rxjs/observable/of';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { delay } from 'rxjs/operators/delay';

import { takeWhile } from 'rxjs/operators/takeWhile';
import { SearchInputComponent } from '..';
import { NbSearchService, NbThemeService } from '@nebular/theme';

/**
 * Beautiful full-page search control.
 *
 * @styles
 *
 * search-btn-open-fg:
 * search-btn-close-fg:
 * search-bg:
 * search-bg-secondary:
 * search-text:
 * search-info:
 * search-dash:
 * search-placeholder:
 */
@Component({
  selector: 'bt-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['search.component.scss'],
  template: `
    <button class="start-search" (click)="openSearch()">
      <i class="nb-search"></i>
    </button>
    <ng-template #attachedSearchContainer></ng-template>
  `,
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  private alive = true;

  /**
   * Tags a search with some ID, can be later used in the search service
   * to determine which search component triggered the action, if multiple searches exist on the page.
   *
   * @type {string}
   */
  @Input() tag: string;

  /**
   * Search input placeholder
   * @type {string}
   */
  @Input() placeholder: string = 'Search...';

  /**
   * Hint showing under the input field to improve user experience
   *
   * @type {string}
   */
  @Input() hint: string = 'Hit enter to search';

  @HostBinding('class.show') showSearch: boolean = false;

  @ViewChild('attachedSearchContainer', {read: ViewContainerRef}) attachedSearchContainer: ViewContainerRef;

  private searchFieldComponentRef$ = new BehaviorSubject<ComponentRef<any>>(null);
  private searchType: string = 'rotate-layout';
  private activateSearchSubscription: Subscription;
  private deactivateSearchSubscription: Subscription;
  private routerSubscription: Subscription;

  constructor(private searchService: NbSearchService,
              private themeService: NbThemeService,
              private router: Router) {
  }

  /**
   * Search design type, available types are
   * modal-zoomin, rotate-layout, modal-move, curtain, column-curtain, modal-drop, modal-half
   * @type {string}
   */
  @Input()
  set type(val: any) {
    this.searchType = val;
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        takeWhile(() => this.alive),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe(event => this.searchService.deactivateSearch(this.searchType, this.tag));

    this.activateSearchSubscription = combineLatest([
      this.searchFieldComponentRef$,
      this.searchService.onSearchActivate(),
    ])
      .pipe(
        takeWhile(() => this.alive),
        filter(([componentRef, data]: [ComponentRef<any>, any]) => !this.tag || data.tag === this.tag),
      )
      .subscribe(([componentRef, data]: [ComponentRef<any>, any]) => {
        this.showSearch = true;

        this.themeService.appendLayoutClass(this.searchType);
        observableOf(null).pipe(delay(0)).subscribe(() => {
          this.themeService.appendLayoutClass('with-search');
        });
        componentRef.instance.showSearch = true;
        componentRef.instance.inputElement.nativeElement.focus();
        componentRef.changeDetectorRef.detectChanges();
      });

    this.deactivateSearchSubscription = combineLatest([
      this.searchFieldComponentRef$,
      this.searchService.onSearchDeactivate(),
    ])
      .pipe(
        takeWhile(() => this.alive),
        filter(([componentRef, data]: [ComponentRef<any>, any]) => !this.tag || data.tag === this.tag),
      )
      .subscribe(([componentRef, data]: [ComponentRef<any>, any]) => {
        this.showSearch = false;

        componentRef.instance.showSearch = false;
        componentRef.instance.inputElement.nativeElement.value = '';
        componentRef.instance.inputElement.nativeElement.blur();
        componentRef.changeDetectorRef.detectChanges();

        this.themeService.removeLayoutClass('with-search');
        observableOf(null).pipe(delay(500)).subscribe(() => {
          this.themeService.removeLayoutClass(this.searchType);
        });
      });
  }

  ngAfterViewInit() {
    this.themeService.appendToLayoutTop(SearchInputComponent)
      .subscribe((componentRef: ComponentRef<any>) => {
        this.connectToSearchField(componentRef);
      });
  }

  openSearch() {
    this.searchService.activateSearch(this.searchType, this.tag);
  }

  connectToSearchField(componentRef) {
    componentRef.instance.searchType = this.searchType;
    componentRef.instance.placeholder = this.placeholder;
    componentRef.instance.hint = this.hint;
    componentRef.instance.searchClose.subscribe(() => {
      this.searchService.deactivateSearch(this.searchType, this.tag);
    });
    componentRef.instance.search.subscribe(term => {
      this.searchService.submitSearch(term, this.tag);
      this.searchService.deactivateSearch(this.searchType, this.tag);
    });
    componentRef.instance.tabOut
      .subscribe(() => this.showSearch && componentRef.instance.inputElement.nativeElement.focus());

    componentRef.changeDetectorRef.detectChanges();

    this.searchFieldComponentRef$.next(componentRef)
  }

  ngOnDestroy() {
    this.alive = false;

    const componentRef = this.searchFieldComponentRef$.getValue();
    if (componentRef) {
      componentRef.destroy();
    }
  }
}
