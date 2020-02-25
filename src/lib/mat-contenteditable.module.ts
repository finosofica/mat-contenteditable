import { NgModule } from '@angular/core';

import { MatContenteditableDirective } from './mat-contenteditable.directive';
import { MatCkeditorDirective } from './mat-ckeditor.directive';
import { MatCkeditorBalloonDirective } from './mat-ckeditor-balloon.directive';
import { FormFieldSizerDirective } from './form-field-sizer.directive';

@NgModule({
  imports: [
  ],
  declarations: [ MatContenteditableDirective, MatCkeditorDirective, MatCkeditorBalloonDirective, FormFieldSizerDirective ],
  exports: [ MatContenteditableDirective, MatCkeditorDirective, MatCkeditorBalloonDirective, FormFieldSizerDirective ],
})
export class MatContenteditableModule { }
