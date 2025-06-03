import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taller',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css']
})
export class WorkshopComponent implements OnInit {
  tallerForm!: FormGroup;
  isSubmitting = false;
  errorMsg = '';
  private baseUrl = 'http://localhost:8080/api/talleres';
  cliente: any;
  esModoRegistro: boolean = true;

  constructor(
    private fb: FormBuilder, // Constructor de formularios
    private http: HttpClient, // Cliente HTTP
    private router: Router // Router para navegación
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con validaciones
    this.tallerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      cif: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
      direccion: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });

    // Carga datos del taller si existen en localStorage
    const storedCliente = localStorage.getItem('cliente');
    if (storedCliente) {
      this.cliente = JSON.parse(storedCliente);
      this.esModoRegistro = !this.cliente?.cif;
      this.tallerForm.patchValue(this.cliente);
    } else {
      this.cliente = {};
      this.esModoRegistro = true;
    }
  }

  // Validador personalizado: confirma que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }
 
 // Método que se ejecuta al enviar el formulario 
 onSubmit(): void {
  if (this.tallerForm.invalid) {
    this.markFormGroupTouched(this.tallerForm);
    return;
  }

  // Construye el objeto con los datos del taller
  const tallerData = {
    nombre: this.tallerForm.get('nombre')?.value,
    cif: this.tallerForm.get('cif')?.value,
    email: this.tallerForm.get('email')?.value,
    telefono: this.tallerForm.get('telefono')?.value,
    direccion: this.tallerForm.get('direccion')?.value,
    codigoPostal: this.tallerForm.get('codigoPostal')?.value,
    ciudad: this.tallerForm.get('ciudad')?.value,
    provincia: this.tallerForm.get('provincia')?.value,
    password: this.tallerForm.get('password')?.value
  };

  this.isSubmitting = true;
  this.errorMsg = '';

  // Si es un nuevo taller, realiza un POST
  if (this.esModoRegistro) {
    this.http.post<any>(this.baseUrl, tallerData).subscribe({
      next: (response) => {
        localStorage.setItem('cliente', JSON.stringify(response));
        this.tallerForm.reset();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMsg = error.status === 409
          ? 'El CIF o correo ya está registrado.'
          : 'Ha ocurrido un error. Inténtalo de nuevo.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  } else {
    // Si es taller existente, realiza un PUT para actualizar
    const id = this.cliente?.id;
    if (!id) {
      this.errorMsg = 'No se pudo identificar el taller a actualizar.';
      this.isSubmitting = false;
      return;
    }

    this.http.put<any>(`${this.baseUrl}/${id}`, tallerData).subscribe({
      next: (response) => {
        localStorage.setItem('cliente', JSON.stringify(response));
      },
      error: (error) => {
        this.errorMsg = 'Error al actualizar el taller. Intenta nuevamente.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
  // Método para eliminar el taller actual
  deleteTaller(): void {
    if (!this.cliente || !this.cliente.id) {
      console.error('No hay taller para eliminar.');
      return;
    }

    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu taller? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    this.isSubmitting = true;
    this.errorMsg = '';

    this.http.delete(`${this.baseUrl}/${this.cliente.id}`).subscribe({
      next: () => {
        localStorage.removeItem('cliente');
        localStorage.removeItem('auth_token');
        this.tallerForm.reset();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al eliminar el taller:', error);
        this.errorMsg = 'Hubo un error al intentar eliminar el taller. Inténtelo de nuevo más tarde.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
