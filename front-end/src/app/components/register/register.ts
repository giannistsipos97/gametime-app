import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, InputText, ButtonDirective, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  user: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  onSubmit() {
    // Basic validation
    if (this.user.password !== this.user.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Wrong password',
        detail: "Passwords don't match!",
      });
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registration successful',
          detail: 'You can now log in.',
        });
        this.router.navigate(['/login']); // Send them to login page
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Registration failed',
          detail: err.error.message || 'Please try again.',
        });
      },
    });
  }
}
