# what is a pipe?
## a pipe transforms data for display in templetes it is like a filter that formates data without modifying original data
 ## | is used to data flow gets in and transformed,flow outs


# steps

 1. # how to creat pipes
 ## ng g p pipes/<name>

 2. ## it will create two files 
 1.name.pepe.ts   ==>> our logic
 2.name.pipe.spec.ts  ==>>  tests

3. import the class of pipe into app.ts file 
import {FilterTodosPipe} from './pipes/filter-todos-pipe'

4. import name class them into component 
  imports: [FormsModule,FilterTodosPipe],

5. pass the data through pipe using | operator
   ``` @for(todo of todos()|filterTodos:radio(); track todo; let i = $index) ```
6. it goes to tansform() and returns the formated data
  transform(value: unknown[], ...args: unknown): unknown[] {}

  * change the type into any for value and args and return

  transform(value: any[], args: any): any[] {}
ex:```
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
```



# how it works 
1.@pipe decorator registers it with a name 
2.pipeTransform interface enforces transform method 
3.transform() recives the value + argsss
4.returns the transformed data 

## why we use pipes
1.seperations of concerns tempelets will be cleannn
2.resuability -- we can once create a pipe we can use it any where in any templete
3.performence -- smart change detection they will run only when data is modified only 
* pipe runs only when input changes 
* easy to test in isolation

## what : transforms data for display
## why : clean templates ,resuable,better performence
## where : in templetes using | operator
## how : create a cls with pipe transfrom ,register in module
## when : for display formating ,not for logic or side effects


## inputs in angular
# what is input 
 * it is a way to get data from user
## 3 ways to get user data input 
1. simple way: two-way binding [ngModel] 
2. prfessional :reactive Forms [formgroups]
3. getting Click/event data - event binding

# steps 
1. import from core
import { Component, signal ,model} from '@angular/core';
2. import to component 
  imports: [FormsModule], 
  like ex:
```
@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
```
3. declare 
newtodo = model('',[],{}); 
4. in app html use it 
  <input type="text" [(ngModel)]="newtodo" placeholder="enter todo">
5. then if user enter the data in input field we can get that data in app.ts
6. u just need to call the varabile like ex: newtodo();
alert(newtodo()) ===> go to gymm
