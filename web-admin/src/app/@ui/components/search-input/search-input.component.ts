import { Component, ElementRef, EventEmitter, Output, ViewChild, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ngx-search-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    'styles/search.component.modal-zoomin.scss',
    'styles/search.component.layout-rotate.scss',
    'styles/search.component.modal-move.scss',
    'styles/search.component.curtain.scss',
    'styles/search.component.column-curtain.scss',
    'styles/search.component.modal-drop.scss',
    'styles/search.component.modal-half.scss',
    'search-input.component.scss',
  ],
  template: `
    <div class="search" (keyup.esc)="closeSearch()">
      <button (click)="closeSearch()">
        <i class="nb-close-circled"></i>
      </button>
      <div class="form-wrapper">
        <form class="form" (keyup.enter)="submitSearch(searchInput.value)">
          <div class="form-content">
            <input class="search-input"
                   #searchInput
                   autocomplete="off"
                   [attr.placeholder]="placeholder"
                   tabindex="-1"
                   (blur)="tabOut.next($event)"/>
          </div>
          <span class="info">{{ hint }}</span>
        </form>
      </div>
    </div>
  `,
})
export class SearchInputComponent {

  static readonly TYPE_MODAL_ZOOMIN = 'modal-zoomin';
  static readonly TYPE_ROTATE_LAYOUT = 'rotate-layout';
  static readonly TYPE_MODAL_MOVE = 'modal-move';
  static readonly TYPE_CURTAIN = 'curtain';
  static readonly TYPE_COLUMN_CURTAIN = 'column-curtain';
  static readonly TYPE_MODAL_DROP = 'modal-drop';
  static readonly TYPE_MODAL_HALF = 'modal-half';

  @Input() searchType: string = SearchInputComponent.TYPE_ROTATE_LAYOUT;
  @Input() placeholder: string;
  @Input() hint: string;

  @Output() searchClose = new EventEmitter();
  @Output() search = new EventEmitter();
  @Output() tabOut = new EventEmitter();


  @ViewChild('searchInput') inputElement: ElementRef;

  @Input() @HostBinding('class.show') showSearch: boolean = false;

  @HostBinding('class.modal-zoomin')
  get modalZoomin() {
    return this.searchType === SearchInputComponent.TYPE_MODAL_ZOOMIN;
  }

  @HostBinding('class.rotate-layout')
  get rotateLayout() {
    return this.searchType === SearchInputComponent.TYPE_ROTATE_LAYOUT;
  }

  @HostBinding('class.modal-move')
  get modalMove() {
    return this.searchType === SearchInputComponent.TYPE_MODAL_MOVE;
  }

  @HostBinding('class.curtain')
  get curtain() {
    return this.searchType === SearchInputComponent.TYPE_CURTAIN;
  }

  @HostBinding('class.column-curtain')
  get columnCurtain() {
    return this.searchType === SearchInputComponent.TYPE_COLUMN_CURTAIN;
  }

  @HostBinding('class.modal-drop')
  get modalDrop() {
    return this.searchType === SearchInputComponent.TYPE_MODAL_DROP;
  }

  @HostBinding('class.modal-half')
  get modalHalf() {
    return this.searchType === SearchInputComponent.TYPE_MODAL_HALF;
  }

  closeSearch() {
    this.searchClose.emit(true);
  }

  submitSearch(term) {
      this.search.emit(term);
  }
}