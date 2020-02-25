import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher, mixinErrorState, CanUpdateErrorStateCtor } from '@angular/material/core';

export class MatInputBase {

  constructor(public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl) { }

}

export const _MatInputMixinBase: CanUpdateErrorStateCtor & typeof MatInputBase =
  mixinErrorState(MatInputBase);
