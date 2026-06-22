import { Directive, ElementRef, EventEmitter, HostListener, Input,Output } from '@angular/core';

@Directive({
  selector: '[appClickCOunter]',
  standalone:true
})
export class ClickCOunter {
  @Input() appClickLimit = 3;
  
  @Output() onLimitReached = new EventEmitter<void>(); 

  private clickcount = 0;

  constructor(private el:ElementRef) {}

  @HostListener('click')
  onClick(){
    this.clickcount++;

    if(this.clickcount>= this.appClickLimit){
      this.el.nativeElement.disabled = true;
      this.el.nativeElement.style.opacity = '0.5';
      this.el.nativeElement.style.cursor = 'not-allowed';
      this.onLimitReached.emit();
      console.log('button disabled after '+this.clickcount);
    }else{
      console.log('button clicks remaining  '+(this.appClickLimit - this.clickcount));

    }
  }

}
