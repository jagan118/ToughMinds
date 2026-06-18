import { Component, signal ,model} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {FilterTodosPipe} from './pipes/filter-todos-pipe'
import {NumToWordPipe} from './pipes/num-to-word-pipe'
@Component({
  selector: 'app-root',
  imports: [FormsModule,FilterTodosPipe,NumToWordPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

// Create a signal with the `signal` function.
  firstName = signal('Morgan');


  // =====counter=======
  count = signal(0);
  inc(){
    this.count.update((count) => count + 1);
  }
  dec(){
    this.count.update((count) => count - 1);
  }
// =======================


//todo list 

todos = signal([
{
  title:'go to gym',
  status:false
},
{
  title:'pay rent',
  status:true
},
{
  title:'go temple',
  status:false
},
]);

newtodo = model('');
radio = model('');

addTodo(){
 this.todos.update(todo => {
  return [...this.todos(),{title:this.newtodo(),status:false}]
 })
}
deleteTodo(index:any){
 this.todos.update(todo => {
  return this.todos().filter((todo,i)=>i!==index)   
 })
}

toggleStatus(index:any){
  this.todos.update((todo) =>{
    return this.todos().map((todo,i)=>{
      if(i===index){
        todo.status = !todo.status;
      }
      return todo
    })
  })

}

//=======================================
//Number to word converter
number :number = 0;

convert(){
// alert(this.number())

}


constructor() {
// Read a signal value by calling it— signals are functions.
 console.log(this.firstName());
// Change the value of this signal by calling its `set` method with a new value.
 this.firstName.set('Jaime');
// You can also use the `update` method to change the value
// based on the previous value.
 this.firstName.update((name) => name.toUpperCase());


// counter = signal(0);



}

}
