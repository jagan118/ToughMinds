import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);
  authService = inject(AuthService);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(res=>
    {
      alert('login succesfull..!!!');
      console.log(res);
      
      localStorage.setItem('token',res.token)
      this.router.navigate(['']);
    }
    )
  }
}
