import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        alert('Login successful!');
        this.router.navigate(['/admin']);
      },
      error: () => {
        alert('Login failed');
        this.loading = false;
      }
    });
  }
}