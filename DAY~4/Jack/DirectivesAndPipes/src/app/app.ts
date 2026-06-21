import { Component, signal ,effect,PLATFORM_ID,inject} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {ColorChangeDirective} from './directives/color-change-directive'
import { CommonModule ,isPlatformBrowser} from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import {TextTransform} from './directives/text-transform';
import {ClickCOunter} from './directives/click-counter'
import { ShowHideEle } from './directives/show-hide-ele';

@Component({
  selector: 'app-root',
  imports: [ShowHideEle,FormsModule,ClickCOunter,ColorChangeDirective,ReactiveFormsModule,CommonModule,TextTransform],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
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
