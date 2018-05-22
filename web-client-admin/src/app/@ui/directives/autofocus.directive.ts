import { Directive, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[btAutofocus]'
})
export class AutofocusDirective implements OnInit, AfterViewInit {
    private _autofocus;
    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        if (this._autofocus || typeof this._autofocus === 'undefined') {
            this.el.nativeElement.focus();
        }
    }

    ngOnInit() {
        // if (this._autofocus || typeof this._autofocus === 'undefined') {
        //     this.el.nativeElement.focus();
        // }
    }

    @Input() set autofocus(condition: boolean) {
        this._autofocus = condition !== false;
    }
}
