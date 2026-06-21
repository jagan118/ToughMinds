import { Directive, ElementRef, HostListener, Input, Signal ,effect} from '@angular/core';

@Directive({
  selector: '[appColorChangeDirective]',
  standalone:true
})
export class ColorChangeDirective {
  @Input() BgColor = 'yellow';
  @Input() textColor = 'black';

  @Input() validate: Signal<boolean> = null!;

  constructor(private el:ElementRef) {

    effect(() => {
      if (this.validate?.() === true) {
        this.el.nativeElement.style.border = '2px solid red';
        this.el.nativeElement.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
      } else {
        this.el.nativeElement.style.border = '';
        this.el.nativeElement.style.boxShadow = '';
      }
    });

  }

  @HostListener('mouseenter')
  onMouseEnter(){
    this.highlight(this.BgColor,this.textColor);
  }
  @HostListener('mouseleave')
  onMouseLeave(){
    this.highlight('transparent','black');
  }

  private highlight(bgColor:string,textColor:string){
    this.el.nativeElement.style.backgroundColor = bgColor;
    this.el.nativeElement.style.color = textColor;
    this.el.nativeElement.style.padding = '5px';
    this.el.nativeElement.style.transition = '0.3s'
  }

}



