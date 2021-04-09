import { Directive, HostListener, ElementRef, Renderer2, HostBinding } from '@angular/core';

@Directive({
  selector: '[appText]'
})
export class TextDirective {
  constructor(private item: ElementRef, private renderer: Renderer2) {
  }
 
  @HostListener("click")
  onclick() {
    this.renderer.setStyle(this.item.nativeElement, "backgroundColor", "cyan");
  }
 
  @HostListener("change")
  onchange() {
    this.renderer.setStyle(this.item.nativeElement, "backgroundColor", "yellow");
  }
}