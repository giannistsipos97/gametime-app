import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from "primeng/inputtext";
import { ButtonDirective } from "primeng/button";
import { User } from '../../models/User';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, InputText, ButtonDirective],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  user: User = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};


  onSubmit() {
    console.log('Form submitted:', this.user);
  }
}
