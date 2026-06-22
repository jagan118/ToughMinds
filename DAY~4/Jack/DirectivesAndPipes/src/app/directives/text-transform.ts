import { Directive,ElementRef,HostListener,EventEmitter,Input,signal,Output,Self,Optional } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';

@Directive({
  selector: '[appTextTransform]',
  standalone:true
})
export class TextTransform {

  @Input() appTextTransform: 'uppercase' | 'lowercase' | 'capitalize' = 'uppercase';
  constructor(private el:ElementRef,  
      @Self() @Optional() private ngControl?: NgControl
) {

  }

  @HostListener('input')
  onInput(){
    const value = this.el.nativeElement.value;
    let transformedvalue = value;

    switch(this.appTextTransform) {
      case 'uppercase':
        this.el.nativeElement.value = value.toUpperCase();
        break;
      case 'lowercase':
        this.el.nativeElement.value = value.toLowerCase();
        break;
      case 'capitalize':
        this.el.nativeElement.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        break;
    }
    transformedvalue = this.el.nativeElement.value;
    if (this.ngControl) {
      const control = this.ngControl.control as FormControl;
      control?.setValue(this.el.nativeElement.value, { emitEvent: false });
    }
  
  }
}
