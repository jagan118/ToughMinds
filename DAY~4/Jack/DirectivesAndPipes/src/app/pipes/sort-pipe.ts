import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, args: any): any {
    // console.log(value);
    // console.log(args);
  const result =   value.sort((a:any,b:any)=> {

    let x = a[args].toLowerCase();
    let y = b[args].toLowerCase();

    if(x>y){return 1}
    if(x<y) {return -1}
    return 0;

    })
    
    return value;
  }
}
