import { Directive, Input, HostBinding, ViewContainerRef, OnInit, Optional, Self, DoCheck } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ErrorStateMatcher, mixinErrorState, CanUpdateErrorStateCtor, CanUpdateErrorState } from '@angular/material/core';
// import { CKEditorComponent } from '@ckeditor/ckeditor5-angular//ckeditor.component';
import { Subject } from 'rxjs';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { MatInputBase } from './mat-input-base';

export const _MatInputMixinBase: CanUpdateErrorStateCtor & typeof MatInputBase =
  mixinErrorState(MatInputBase);

@Directive({
  selector: '[matCkeditor]',
  providers: [
    { provide: MatFormFieldControl, useExisting: MatCkeditorDirective },
  ]
})
export class MatCkeditorDirective extends _MatInputMixinBase
  implements MatFormFieldControl<string>, DoCheck, CanUpdateErrorState, OnInit {

  /**
   * Implemented as part of MatFormFieldControl.
   * See https://material.angular.io/guide/creating-a-custom-form-field-control
   */
  static nextId = 0;

  @Input()
  get value(): string {
    return !!this.editor.editorInstance && this.editor.editorInstance.getData();
  }
  set value(value: string) {
    if (value !== this.value) {
      this.editor.data = value;
      this.stateChanges.next();
    }
  }

  readonly stateChanges: Subject<void> = new Subject<void>();

  @HostBinding() id = `mat-input-${MatCkeditorDirective.nextId++}`;

  // Need support from Ckeditor
  @Input() placeholder = '';

  @Input() contentEmpty: string[] = ['<br>', '<p>&nbsp;</p>'];
  get empty(): boolean {
    return !this.value || this.contentEmpty.includes(this.value);
  }

  get shouldLabelFloat(): boolean { return this.focused || !this.empty; }

  focused = false;

  @Input() required = false;

  @Input()
  set disabled(isDisabled: boolean) {
    this.editor.setDisabledState(isDisabled);
    this.stateChanges.next();
  }
  get disabled() {
    return this.editor.disabled;
  }

  @HostBinding('attr.aria-invalid') errorState: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher;

  controlType = 'mat-input';

  @HostBinding('attr.aria-describedby') describedBy = '';

  protected editor;

  constructor(
    // @Host() @Self() @Optional() public editor: CKEditorComponent,
    protected readonly viewRef: ViewContainerRef,
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
  }

  ngOnInit() {
    // Can't use injection to get component reference
    // https://github.com/angular/angular/issues/8277
    this.editor = this.viewRef['_data'].componentView.component;
    this.editor.blur.subscribe(() => {
      this.focused = false;
      this.stateChanges.next();
    });
    this.editor.focus.subscribe(() => {
      this.focused = true;
      this.stateChanges.next();
    });
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick() {
    if (this.editor.editorInstance) {
      this.editor.editorInstance.editing.view.focus();
      this.stateChanges.next();
    }
  }

}
