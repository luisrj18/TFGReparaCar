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
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup;
  isSubmitting = false;
  loginError = '';

  constructor() {
    // Inicialización del formulario con validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;  // Extrae los datos del formulario
    const loginUrl = 'http://localhost:8080/api/auth/login';  // URL del backend

    this.isSubmitting = true;
    this.loginError = '';

    // Envía solicitud POST con los datos de login
    this.http.post<any>(loginUrl, loginData).subscribe({
      next: (response) => {
        console.log('Login exitoso', response);
        this.isSubmitting = false;
        console.log('Login exitoso', response);

        if (response) {
          // Guarda los datos del cliente en localStorage
          localStorage.setItem('cliente', JSON.stringify(response));
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        // Muestra mensaje de error si falla el login
        console.error('Error en login', error);
        this.loginError = 'Credenciales incorrectas o error del servidor.';
        this.isSubmitting = false;
      }
    });
  }
}

