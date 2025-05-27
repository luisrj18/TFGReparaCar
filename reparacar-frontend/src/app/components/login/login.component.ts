import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup;
  isSubmitting = false;
  loginError = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;
    const loginUrl = 'http://localhost:8080/api/auth/login';

    this.isSubmitting = true;
    this.loginError = '';

    this.http.post<any>(loginUrl, loginData).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        this.isSubmitting = false;
        console.log('Login exitoso', response);

        if (response) {
          localStorage.setItem('cliente', JSON.stringify(response));
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error en login', error);
        this.loginError = 'Credenciales incorrectas o error del servidor.';
        this.isSubmitting = false;
      }
    });
  }
}

