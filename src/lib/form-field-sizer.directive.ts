import { Directive, Renderer2, ElementRef, AfterContentInit } from '@angular/core';

@Directive({
  selector: '[formFieldSizer]'
})
export class FormFieldSizerDirective implements AfterContentInit {

  constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
  ) { }

  ngAfterContentInit(): void {
    this.updateSize();
  }

  updateSize() {
    const infix = this.getElement('mat-form-field-infix');
    this.renderer.removeStyle(infix, 'min-height');

    setTimeout(() => {
      const wrapper = this.getElement('mat-form-field-wrapper');
      const offset = this.elementRef.nativeElement.offsetHeight -
        wrapper.offsetHeight -
        parseFloat(getComputedStyle(wrapper).marginTop) -
        parseFloat(getComputedStyle(wrapper).marginBottom) +
        parseFloat(getComputedStyle(infix).height);

      this.renderer.setStyle(infix, 'min-height', `${offset}px`);
    });
  }

  private getElement(name: string): HTMLElement {
    return this.elementRef.nativeElement.getElementsByClassName(name).item(0);
  }

}
