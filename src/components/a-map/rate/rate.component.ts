import { Component, Input, forwardRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const RATING_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RateComponent),
  multi: true
};

@Component({
  selector: 'rate',
  templateUrl: 'rate.component.html',
  providers: [RATING_CONTROL_VALUE_ACCESSOR]
})
export class RateComponent implements ControlValueAccessor, OnInit {
  //Private member
  private _maxRate: number = 5;
  private _isReadOnly: boolean = false;
  private _emptyIconName: string = 'star-outline';
  private _halfIconName: string = 'star-half';
  private _starIconName: string = 'star';
  private _isNullable: boolean = false;
  private _innerValue: any;
  private _starIndexes: Array<number>;
  //Private member

  //Constructor
  constructor(private _cdRef: ChangeDetectorRef) {
  }
  //Constructor

  //Protected property
  @Input()
  protected get starIndexes() {
    return this._starIndexes;
  }

  @Input()
  protected get max() {
    return this._maxRate;
  }
  protected set max(val: any) {
    this._maxRate = this.getNumberPropertyValue(val);
  }
  @Input()
  protected get readOnly() {
    return this._isReadOnly;
  }
  protected set readOnly(val: any) {
    this._isReadOnly = this.isTrueProperty(val);
  }
  @Input()
  protected get emptyStarIcon() {
    return this._emptyIconName;
  }
  protected set emptyStarIcon(val: any) {
    this._emptyIconName = val;
  }
  @Input()
  protected get halfStarIcon() {
    return this._halfIconName;
  }
  protected set halfStarIcon(val: any) {
    this._halfIconName = val;
  }
  @Input()
  protected get starIcon() {
    return this._starIconName;
  }
  protected set starIcon(val: any) {
    this._starIconName = val;
  }
  @Input()
  protected get nullable() {
    return this._isNullable;
  }
  protected set nullable(val: any) {
    this._isNullable = this.isTrueProperty(val);
  }
  //Protected property

  //Implements interface
  ngOnInit() {
    this._starIndexes = Array(this.max).fill(1).map((x, i) => i);
  }
  //Implements interface

  //Public method
  public getStarIconName(starIndex: number) {
    if (this.value === undefined) {
      return this.emptyStarIcon;
    }

    if (this.value > starIndex) {
      if (this.value < starIndex + 1) {
        return this.halfStarIcon;
      } else {
        return this._starIconName;
      }
    } else {
      return this.emptyStarIcon;
    }
  }

  public rate(value: number) {
    if (this.readOnly || value < 0 || value > this.max) {
      return;
    }

    if (value === this.value && this.nullable) {
      value = null;
    }

    this.value = value;
  }

  public get value(): any {
    return this._innerValue;
  }

  public set value(value: any) {
    if (value !== this._innerValue) {
      this._innerValue = value;
      this.onChangeCallback(value);
    }
  }

  public writeValue(value: any) {
    if (value !== this._innerValue) {
      this._innerValue = value;
      //To fix change detection
      this._cdRef.detectChanges();
    }
  }

  public registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
  }

  public onKeyDown(event: any) {
    if (/(37|38|39|40)/.test(event.which)) {
      event.preventDefault();
      event.stopPropagation();

      let newValue = this.value + ((event.which == 38 || event.which == 39) ? 1 : -1);
      return this.rate(newValue);
    }
  }
  //Public method

  //Private method
  private onChangeCallback: (_: any) => void = noop;

  private isTrueProperty(val: any): boolean {
    if (typeof val === 'string') {
      val = val.toLowerCase().trim();
      return (val === 'true' || val === 'on');
    }
    return !!val;
  }

  private getNumberPropertyValue(val: any): number {
    if (typeof val === 'string') {
      return parseInt(val.trim());
    }
    return val;
  }
  //Private method
}
