import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTodos',
})
export class FilterTodosPipe implements PipeTransform {
  transform(value: any[], status: string): any[] {
    if(status==='All'){
      return value;
    }
    if(status==='Done'){
      return value.filter((todo)=>{return todo.status})
    }
    if(status==='Pending'){
      return value.filter((todo)=>{return !todo.status})
    }
    return value;
  }
}
