import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  registerError = '';
  showUserTypeModal = true;
  private baseUrl = 'http://localhost:8080/api/clientes';
  cliente: any;

  constructor(
    private fb: FormBuilder, // Constructor de formularios
    private authService: AuthService, // Servicio de autenticación
    private http: HttpClient, // Cliente HTTP para llamadas al backend
    private router: Router  // Servicio de enrutamiento
  ) {}

  ngOnInit(): void {
    this.initForm();  // Inicializa el formulario
    let cliente = JSON.parse(localStorage.getItem('cliente')!);
    if(cliente){
      this.cliente = cliente;
      this.registerForm.patchValue(cliente)  // Rellena el formulario con los datos existentes
      this.showUserTypeModal=false;
    }
  }

  // Lógica para seleccionar el tipo de usuario y redireccionar
  selectUserType(userType: 'particular' | 'taller'): void {
    this.showUserTypeModal = false;
    
    if (userType === 'taller') {     
      this.router.navigate(['/workshop']);  // Redirecciona a registro de taller
    }

    if (userType === 'particular') {     
      this.router.navigate(['/register']); // Redirecciona a registro de cliente
    }
   
  }

  closeModal(): void {
    this.router.navigate(['/home']);
  }

  // Inicialización del formulario con validaciones para cada campo
  initForm(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      direccion: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Valida que los campos password y confirmPassword coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Procesa el envío del formulario: creación o edición de usuario
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }
    
    // Construye el objeto de usuario a partir del formulario
    const userData = {
      nombre: this.registerForm.get('nombre')?.value,
      apellidos: this.registerForm.get('apellidos')?.value,
      email: this.registerForm.get('email')?.value,
      telefono: this.registerForm.get('telefono')?.value,
      password: this.registerForm.get('password')?.value,
      direccion: this.registerForm.get('direccion')?.value,
      codigoPostal: this.registerForm.get('codigoPostal')?.value,
      ciudad: this.registerForm.get('ciudad')?.value,
      provincia: this.registerForm.get('provincia')?.value
    };
    console.log(userData);
    
    this.isSubmitting = true;
    this.registerError = '';

    if(this.cliente){
      // Actualiza los datos del cliente existente
      this.http.put<any>(this.baseUrl+"/"+`${this.cliente.id}`, userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        localStorage.setItem('cliente', JSON.stringify(response));
        const token = response?.token;
        if (token) {
          localStorage.setItem('auth_token', token);
        }
this.router.navigate(['/home']);
        this.registerForm.reset();
      },
      error: (error) => {
        console.error('Error en el registro', error);

        if (error.status === 409) {
          this.registerError = 'El correo electrónico ya está registrado.';
        } else if (error.error?.message) {
          this.registerError = error.error.message;
        } else {
          this.registerError = 'Ha ocurrido un error durante el registro. Inténtelo nuevamente más tarde.';
        }
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
    }else{
      // Crea un nuevo cliente
    this.http.post<any>(this.baseUrl, userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        localStorage.setItem('cliente', JSON.stringify(response));
        const token = response?.token;
        if (token) {
          localStorage.setItem('auth_token', token);
        }

        this.registerForm.reset();
        //localStorage.removeItem('cliente');
        this.router.navigate(['/appointment']);
      },
      error: (error) => {
        console.error('Error en el registro', error);

        if (error.status === 409) {
          this.registerError = 'El correo electrónico ya está registrado.';
        } else if (error.error?.message) {
          this.registerError = error.error.message;
        } else {
          this.registerError = 'Ha ocurrido un error durante el registro. Inténtelo nuevamente más tarde.';
        }
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }  
}
  // Permite eliminar la cuenta del cliente actual
  deleteCliente(): void {
    if (!this.cliente || !this.cliente.id) {
      console.error('No hay cliente para eliminar.');
      return;
    }

    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    this.isSubmitting = true;
    this.registerError = '';

    this.http.delete(`${this.baseUrl}/${this.cliente.id}`).subscribe({
      next: () => {
        console.log('Cliente eliminado correctamente');
        localStorage.removeItem('cliente');
        localStorage.removeItem('auth_token');
        this.registerForm.reset();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al eliminar el cliente:', error);
        this.registerError = 'Hubo un error al intentar eliminar la cuenta. Inténtelo de nuevo más tarde.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  // Maneja errores de registro o edición y establece mensajes apropiados
  handleError(error: any): void {
    console.error('Error en el registro', error);
    if (error.status === 409) {
      this.registerError = 'El correo electrónico ya está registrado.';
    } else if (error.error?.message) {
      this.registerError = error.error.message;
    } else {
      this.registerError = 'Ha ocurrido un error durante el registro. Inténtelo nuevamente más tarde.';
    }
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