import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
   standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  gender =signal('');
  male = signal(true)
  female = signal(true)
  genders = ["https://th.bing.com/th/id/OIP.zHMi4cVNwyF77ye0x8jScwHaH7?pid=ImgDet&rs=1","https://cdn2.iconfinder.com/data/icons/avatars-2-7/128/28-1024.png"]
  //==================

  btnEvent(btn:HTMLButtonElement){
    console.log(btn.innerText);
    
  }

  box1 = signal(true);
  box2 = signal(false);
  pickDate = signal('');


//======================
  condition = signal(true);
numShow = 0;
  emit(num:number){
this.numShow=num;
    // alert("hii")
    this.condition.update((v)=> !v);
  }

  //===========================
  todo = signal('');
  addTodo(){
    // alert(this.todo());
    this.todos.update((todo) => {
      return [...this.todos(),{title:this.todo(),status:false}]
    })
    this.todo.set('')
  }
  deleteTodo(index:any){
    this.todos.update((todos) => {
      return this.todos().filter((todo,i) => i!==index)
    })
  }


  todos = signal([
    {
      title:'go to gym',
      status:false
    },
    {
      title:'go to temple',
      status:true
    },
    {
      title:'go to parkk',
      status:true
    },
    {
      title:'go to chetluuu',
      status:false
    }
  ])

  //==============================

   images = [
    'https://cdn.iconscout.com/icon/premium/png-256-thumb/bicycle-2169135-1819011.png',
    'https://cdn.iconscout.com/icon/premium/png-256-thumb/heavy-bike-1978235-1667773.png',
    'https://static.thenounproject.com/png/3381476-200.png',
    'https://cdn.iconscout.com/icon/premium/png-256-thumb/sedan-car-3309664-2752353.png',
    'https://st2.depositphotos.com/5255311/9644/v/950/depositphotos_96441336-stock-illustration-van-icon-on-white-background.jpg',
  ];
  imgUrl = this.images[0];
  currentImg = this.imgUrl;
  imgNo = 0;
  passengerCount=1;
hoverImg(event:any,index:any){
  // alert(index);
this.imgNo = index;
this.imgUrl = this.images[this.imgNo];
}
  showImg(index:any){
this.currentImg = this.images[index];
this.imgUrl = this.images[index];
this.passengerCount=index+1
  }
imgOut(event:any){
  this.imgUrl = this.currentImg;
}
  nums = [1,2,3,4,5]
 

  //=============================


  
  like(){
    this.count.likes.update((value) => value + 1);
  }
  dislike(){
    this.count.dislikes.update((value) => value + 1);
  }
count = {
  likes:signal(0),
  dislikes:signal(0)
}
  //========================
  currentTime = signal(new Date().toLocaleTimeString());
  intervalId = setInterval(()=>{
    this.currentTime.set(new Date().toLocaleTimeString());
  },1000)
  //=======================
  showMsg = signal(false);
  
  show(){
this.showMsg.update((value) => !value);
// alert('Hello World');
  }
  //==========
  conditionCls = true;
arr = [12,23,34,5,6,21,45,32,7,88,30]

//====================
  genderIMG = ["https://i.pinimg.com/736x/2a/4e/8d/2a4e8dab6791ed643d5180bc72167f6d.jpg",'https://cdn.pixabay.com/photo/2014/04/02/14/10/female-306407_640.png']

students = [
  {
    firstName: 'John',
    lastName: 'Doe',
    age: 20,
    gender:'male',
    result:'pass'
  },
  {
    firstName: 'honey',
    lastName: 'lolii',
    age: 20,
    gender:'female',
    result:'failed'
  },{
    firstName: 'jack',
    lastName: 'Doyyye',
    age: 20,
    gender:'male',
    result:'pass'
  },{
    firstName: 'ammmooi',
    lastName: 'dengeyyy',
    age: 20,
    gender:'female',
    result:'failed'
  },{
    firstName: 'jijijiji',
    lastName: 'jnbiunmm',
    age: 20,
    gender:'male',
    result:'failed'
  },
]  
  
//=====================
  condition2 = signal(true);
  condition1 = signal(false);

  toggle(){
    this.condition.update((value) => !value);
    this.condition1.update((value) => !value);
  }

}
