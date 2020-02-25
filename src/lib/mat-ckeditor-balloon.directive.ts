import { Directive, Input } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field/form-field-control';
import { MatCkeditorDirective } from './mat-ckeditor.directive';

@Directive({
  selector: '[matCkeditorBalloon]',
  providers: [
    { provide: MatFormFieldControl, useExisting: MatCkeditorBalloonDirective },
  ]
})
export class MatCkeditorBalloonDirective extends MatCkeditorDirective {

  @Input()
  set toolbar(show: boolean) {
    if (this.editor && show !== this.toolbarOpen) {
      const balloon = this.editor.editorInstance.plugins.get('BalloonToolbar');
      if (show) {
        this.showToolbar(balloon);
      } else {
        balloon.hide();
        this.toolbarOpen = false;
      }
    }
  }
  private toolbarOpen: boolean;

  ngOnInit() {
    super.ngOnInit();
    this.editor.ready.subscribe(editor => {
      const balloon = editor.plugins.get('BalloonToolbar');
      balloon.stopListening(editor.model.document.selection, 'change:range');
      balloon.stopListening(balloon, '_selectionChangeDebounced');
    });
    this.editor.focus.subscribe(() => {
      if (this.toolbarOpen) {
        const balloon = this.editor.editorInstance.plugins.get('BalloonToolbar');
        this.showToolbar(balloon);
      }
    });
  }

  private showToolbar(balloon) {
    if (!balloon._balloon.hasView(balloon.toolbarView)) {
      balloon.listenTo(this.editor.editorInstance.ui, 'update', () => {
        balloon._balloon.updatePosition(balloon._getBalloonPositionData());
      });
      balloon._balloon.add({
        view: balloon.toolbarView,
        position: balloon._getBalloonPositionData(),
        balloonClassName: 'ck-toolbar-container'
      });
      this.toolbarOpen = true;
    }
  }

}
