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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
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
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.tallerForm.invalid) {
      this.markFormGroupTouched(this.tallerForm);
      return;
    }

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

    this.http.post<any>(this.baseUrl, tallerData).subscribe({
      next: (response) => {
        localStorage.setItem('cliente', JSON.stringify(response));
        this.tallerForm.reset();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMsg = 'El CIF o correo ya está registrado.';
        } else {
          this.errorMsg = 'Ha ocurrido un error. Inténtalo de nuevo.';
        }
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
