import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  router = inject(Router);
  authService = inject(AuthService);
  signUpForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNo: new FormControl('', [Validators.required, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmpass: new FormControl('', [Validators.required, Validators.minLength(6)]),
    isChecked: new FormControl(false)
  });
  onSubmit() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.authService.signUp(this.signUpForm.value).subscribe((res => {
      alert('Signup Successfull...!!')
      localStorage.setItem('token', res.token);
    }
    ));
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
