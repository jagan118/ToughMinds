import { Pipe, PipeTransform } from '@angular/core';
import { log } from 'node:console';

@Pipe({
  name: 'find',
  standalone:true,
  pure:true
})
export class FindPipe implements PipeTransform {
  transform(value: any[], args: string): any[] {
    console.log(value,args);
    

    if(!value) return[];
    if(!args) return value;

    const lowerkey = args.toLowerCase();

   return  value.filter(emp =>{
    const name = emp.name ? emp.name.toString().toLowerCase() : '';
      const city = emp.city ? emp.city.toString().toLowerCase() : '';
      const age = emp.age ? emp.age.toString().toLowerCase() : '';

      // 2. Strict boolean expression evaluation
      return name.includes(lowerkey) || 
             city.includes(lowerkey) || 
             age.includes(lowerkey);
    });
    
    
  }
}
