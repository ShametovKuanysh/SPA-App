import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errText: string = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService){}

  get lf(){
    return this.registerForm.controls;
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onRegister(){
    if (this.registerForm.valid){
      this.authService.register(this.lf['email'].value, this.lf['email'].value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err: any) => {
          this.errText = err?.error?.message;  // Display error message from server response.
          console.error('Register failed', err)
        }
      });
    }
  }
}
