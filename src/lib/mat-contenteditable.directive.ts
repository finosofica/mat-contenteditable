
import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  Input,
  HostBinding,
  Optional,
  Self,
  DoCheck,
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, CanUpdateErrorState } from '@angular/material/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { _MatInputMixinBase } from './mat-input-base';

@Directive({
  selector: '[contenteditable]',
  providers: [
    { provide: MatFormFieldControl, useExisting: MatContenteditableDirective },
  ]
})
export class MatContenteditableDirective extends _MatInputMixinBase
  implements ControlValueAccessor, MatFormFieldControl<string>, DoCheck, CanUpdateErrorState {

  /**
   * Implemented as part of MatFormFieldControl.
   * See https://material.angular.io/guide/creating-a-custom-form-field-control
   */
  static nextId = 0;

  @Input()
  get value(): string { return this.elementRef.nativeElement[this.propValueAccessor]; }
  set value(value: string) {
    if (value !== this.value) {
      this.elementRef.nativeElement[this.propValueAccessor] = value;
      this.stateChanges.next();
    }
  }

  readonly stateChanges: Subject<void> = new Subject<void>();

  @HostBinding() id = `mat-input-${MatContenteditableDirective.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  focused = false;

  @Input() contentEmpty: Array<string> = ['<br>', '<div><br></div>'];
  get empty(): boolean {
    return !this.value || this.contentEmpty.includes(this.value);
  }

  get shouldLabelFloat(): boolean { return this.focused || !this.empty; }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  @HostBinding('attr.aria-invalid') errorState: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher;

  controlType = 'mat-input';

  @HostBinding('attr.aria-describedby') describedBy = '';


  // Part of ControlValueAccessor
  private onChange: (value: string) => void;
  private onTouched: () => void;
  private removeDisabledState: () => void;

  @Input() propValueAccessor = 'innerHTML';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    // Setting the value accessor directly (instead of using
    // the providers) to avoid running into a circular import.
    if (this.ngControl != null) { this.ngControl.valueAccessor = this; }
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  @HostListener('input')
  callOnChange() {
    if (typeof this.onChange === 'function') {
      this.onChange(this.elementRef.nativeElement[this.propValueAccessor]);
    }
  }

  @HostListener('focus')
  callOnFocused() {
    if (this.focused !== true) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  @HostListener('blur')
  callOnTouched() {
    if (typeof this.onTouched === 'function') {
      this.onTouched();
    }
    if (this.focused !== false) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick() { this.elementRef.nativeElement.focus(); }

  /**
   * Writes a new value to the element.
   * This method will be called by the forms API to write
   * to the view when programmatic (model -> view) changes are requested.
   *
   * See: [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor#members)
   */
  writeValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.elementRef.nativeElement, this.propValueAccessor, normalizedValue);
  }

  /**
   * Registers a callback function that should be called when
   * the control's value changes in the UI.
   *
   * This is called by the forms API on initialization so it can update
   * the form model when values propagate from the view (view -> model).
   */
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * This is called by the forms API on initialization so it can update the form model on blur.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * This function is called by the forms API when the control status changes to or from "DISABLED".
   * Depending on the value, it should enable or disable the appropriate DOM element.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'true');
      this.removeDisabledState = this.renderer.listen(this.elementRef.nativeElement, 'keydown', this.listenerDisabledState);
    } else {
      if (this.removeDisabledState) {
        this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
        this.removeDisabledState();
      }
    }
  }

  private listenerDisabledState(e: KeyboardEvent) {
    e.preventDefault();
  }
}
