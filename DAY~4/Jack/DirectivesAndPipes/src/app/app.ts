import { Component, signal ,effect,PLATFORM_ID,inject} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {ColorChangeDirective} from './directives/color-change-directive'
import { CommonModule ,isPlatformBrowser} from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import {TextTransform} from './directives/text-transform';
import {ClickCOunter} from './directives/click-counter'
import { ShowHideEle } from './directives/show-hide-ele';
import { SortPipe } from './pipes/sort-pipe';
import { FindPipe } from './pipes/find-pipe';

@Component({
  selector: 'app-root',
  imports: [FindPipe,SortPipe,ShowHideEle,FormsModule,ClickCOunter,ColorChangeDirective,ReactiveFormsModule,CommonModule,TextTransform],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  key='name'
  search = signal('');
  
    employees = [
   {"name":"Vishnu","age":"21","gender":"M","city":"Bhimavaram"},
   {"name":"Arun Sai","age":"21","gender":"M","city":"Sangareddy"},
   {"name":"Vinay","age":"24","gender":"M","city":"Hyderabad"},
   {"name":"Susheel","age":"22","gender":"M","city":"Chilkur"},
   {"name":"Akhila","age":"25","gender":"F","city":"Hyderabad"},
   {"name":"Biswabharat","age":"21","gender":"M","city":"Hyderabad"},
   {"name":"Bhagyasree","age":"25","gender":"F","city":"Gachibowli"},
   {"name":"Anshuman","age":"21","gender":"M","city":"Vizag"},
   {"name":"Vamsi","age":"24","gender":"M","city":"Hyderabad"},
   {"name":"Prabhas","age":"38","gender":"M","city":"Bhimavaram"},
   {"name":"Mahesh Babu","age":"42","gender":"M","city":"Hyderabad"},
   {"name":"Allu Arjun","age":"35","gender":"M","city":"Vizag"},
   {"name":"Vijay Devarakonda","age":"30","gender":"M","city":"Hyderabad"},
   {"name":"Rajnikanth","age":"70","gender":"M","city":"Chennai"},
   {"name":"KamalHaasan","age":"60","gender":"M","city":"Chennai"},
   {"name":"Sachin","age":"44","gender":"M","city":"Mumbai"},
   {"name":"Dhoni","age":"40","gender":"M","city":"Mumbai"},
   {"name":"Kajal","age":"35","gender":"F","city":"Delhi"},
   {"name":"Ileana","age":"30","gender":"F","city":"Goa"},
   {"name":"Nayanathara","age":"35","gender":"M","city":"Chennai"},
 ]
  //====================================

  today = new Date()
  json = {
    "id":101,
    "name":"jack",
    "status":"very active"
  }
  price = 899.98
text = 'jack suunin  ininiunbu'
textStrs = ["jack",'mounika','ramu',"devi",'yogi'];

  //==============================
  private platformId = inject(PLATFORM_ID);

  radio = signal('admin');


  //=================
limit = 5;

onLimitReached(){
  alert("limit reached")
}
//======================

  email: any;
  password: any

    isEmailInvalid = signal(false);
  isPasswordInvalid = signal(false);

  // stateCode = signal();
  
  constructor(private fb:FormBuilder){

     effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('userRole', this.radio());
        console.log('localStorage updated safely in browser:', this.radio());
      }
      });

//===================================================
    // this.stateCode.set(this.fb.control(''))

    this.email = this.fb.control('',[
    Validators.required,
    Validators.email
    ]);
    this.password = this.fb.control('',[
    Validators.required,
    Validators.minLength(8)
    ]);

    this.email.statusChanges.subscribe(() => {
      this.isEmailInvalid.set(this.email.invalid && this.email.touched);
      console.log('Email status:', this.email.status);
    });

    this.password.statusChanges.subscribe(() => {
      this.isPasswordInvalid.set(this.password.invalid && this.password.touched);
      console.log('Password status:', this.password.status);
    });
  
  
   
  }



}
