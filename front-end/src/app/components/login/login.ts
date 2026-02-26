import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, InputText, ButtonDirective, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  user: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    const loginData = {
      username: this.user.username,
      password: this.user.password,
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.authService.setSession(response.user, response.token);
        this.messageService.add({
          severity: 'success',
          summary: 'Login successful',
          detail: 'You have been logged in.',
        });
        // Redirect to the tasks page
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed',
          detail: err.error.message,
        });
      },
    });
  }
}
