import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function getText(html: string) {
  if (html) {
    const element = document.createElement('span');
    element.innerHTML = html;
    return element.textContent.replace(/\s/g, '');
  }
  return '';
}

/**
 * @description
 * Provides a set of built-in validators that can be used by form controls.
 *
 * A validator is a function that processes a `FormControl` or collection of
 * controls and returns an error map or null. A null map means that validation has passed.
 *
 * @see [Form Validation](/guide/form-validation)
 *
 * @publicApi
 */
export class HtmlValidators {

  /**
   * @description
   * Validator that requires the control have a non-empty value.
   *
   * @usageNotes
   *
   * ### Validate that the field is non-empty
   *
   * ```typescript
   * const control = new FormControl('', Validators.required);
   *
   * console.log(control.errors); // {required: true}
   * ```
   *
   * @returns An error map with the `required` property
   * if the validation check fails, otherwise `null`.
   *
   */
  static required(control: AbstractControl): ValidationErrors | null {
    const text = getText(control.value);
    return text ? null : { 'required': true };
  }

  /**
   * @description
   * Validator that requires the length of the control's value to be greater than or equal
   * to the provided minimum length. This validator is also provided by default if you use the
   * the HTML5 `minlength` attribute.
   *
   * @usageNotes
   *
   * ### Validate that the field has a minimum of 3 characters
   *
   * ```typescript
   * const control = new FormControl('ng', Validators.minLength(3));
   *
   * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
   * ```
   *
   * ```html
   * <input minlength="5">
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `minlength` if the validation check fails, otherwise `null`.
   */
  static minLength(minLength: number): ValidatorFn {
    const fn = (control: AbstractControl): ValidationErrors | null => {
      const text = getText(control.value);
      if (text) {
        return text.length < minLength ?
          { 'minlength': { 'requiredLength': minLength, 'actualLength': text.length } } :
          null;
      }
      return null;  // don't validate empty values to allow optional controls
    };
    return fn;
  }

  /**
   * @description
   * Validator that requires the length of the control's value to be less than or equal
   * to the provided maximum length. This validator is also provided by default if you use the
   * the HTML5 `maxlength` attribute.
   *
   * @usageNotes
   *
   * ### Validate that the field has maximum of 5 characters
   *
   * ```typescript
   * const control = new FormControl('Angular', Validators.maxLength(5));
   *
   * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
   * ```
   *
   * ```html
   * <input maxlength="5">
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `maxlength` property if the validation check fails, otherwise `null`.
   */
  static maxLength(maxLength: number): ValidatorFn {
    const fn = (control: AbstractControl): ValidationErrors | null => {
      const text = getText(control.value);
      return text.length > maxLength ?
        { 'maxlength': { 'requiredLength': maxLength, 'actualLength': text.length } } :
        null;
    };
    return fn;
  }
}
