import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

interface Appointment {
  id: number;
  nombre: string;
  modeloVehiculo: string;
  matricula: string;
  fecha: Date;
  hora: string;
  servicio: string;
  descripcion: string;
  estado: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cliente_id?: number;
}

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,RouterLink, ReactiveFormsModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  appointmentForm!: FormGroup;
  editMode = false;
  currentAppointmentId: number | null = null;
  filterStatus: string = 'all';
  private baseUrl = 'http://localhost:8080/api/citas';
  clienteId: number | null = null;
  cliente:any
  serviceOptions: string[] = [
    'Mantenimiento general',
    'Cambio de aceite',
    'Revisión de frenos',
    'Diagnóstico electrónico',
    'Cambio de neumáticos',
    'Alineación y balanceo',
    'Reparación de motor',
    'Sistema eléctrico',
    'Aire acondicionado',
    'Chapistería y pintura',
    'Otro'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAppointments();

    this.cliente = JSON.parse(localStorage.getItem('cliente')!);
    if (this.cliente) {
      this.clienteId = this.cliente.id;
      this.appointmentForm.get('nombre')?.setValue(this.cliente.nombre + " " + this.cliente.apellidos);
      this.appointmentForm.get('nombre')?.disable();
    }
  }

  initForm(): void {
    this.appointmentForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      modeloVehiculo: ['', Validators.required],
      matricula: ['', [Validators.required, Validators.pattern('[0-9A-Za-z]{1,7}')]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      servicio: ['', Validators.required],
      descripcion: [''],
      estado: ['pending', Validators.required]
    });
  }

  saveAppointments(): void {
    localStorage.setItem('repara-car-appointments', JSON.stringify(this.appointments));
    //llamar al backend guardar en base de datos
  }

  loadAppointments(): void {
    const savedAppointments = localStorage.getItem('repara-car-appointments');
    if (savedAppointments) {
      this.appointments = JSON.parse(savedAppointments).map((appointment: any) => ({
        ...appointment,
        fecha: new Date(appointment.fecha)
      }));
    }
  }

  submitAppointment(): void {
  if (this.appointmentForm.invalid) {
    this.markFormGroupTouched(this.appointmentForm);
    return;
  }
  
  const formValues = this.appointmentForm.value;

  // Obtener cliente desde localStorage
  const cliente = JSON.parse(localStorage.getItem('cliente')!);

  // Agregar cliente_id a los datos de la cita
  const citaData = {
    ...formValues,
    cliente_id: cliente ? cliente.id : null
  };
  
  if (this.editMode && this.currentAppointmentId !== null) {
    const index = this.appointments.findIndex(a => a.id === this.currentAppointmentId);
    if (index !== -1) {
      this.appointments[index] = {
        ...this.appointments[index],
        ...citaData
      };
    }
  } else {
    const newAppointment: Appointment = {
      id: Date.now(),
      ...citaData,
      fecha: new Date(formValues.fecha)
    };
    this.appointments.push(newAppointment);
  }
  
  this.saveAppointments();
  this.resetForm();
}


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  editAppointment(appointment: Appointment): void {
    this.editMode = true;
    this.currentAppointmentId = appointment.id;

    const formattedDate = this.formatDateForInput(appointment.fecha);

    this.appointmentForm.patchValue({
      nombre: appointment.nombre,
      modeloVehiculo: appointment.modeloVehiculo,
      matricula: appointment.matricula,
      fecha: formattedDate,
      hora: appointment.hora,
      servicio: appointment.servicio,
      descripcion: appointment.descripcion,
      estado: appointment.estado
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteAppointment(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      this.appointments = this.appointments.filter(appointment => appointment.id !== id);
      this.saveAppointments();
    }
  }

  resetForm(): void {
    this.appointmentForm.reset({
      estado: 'pending'
    });

    const cliente = JSON.parse(localStorage.getItem('cliente')!);
    if (cliente) {
      this.appointmentForm.get('nombre')?.setValue(cliente.nombre + " " + cliente.apellidos);
      this.appointmentForm.get('nombre')?.disable();
    } else {
      this.appointmentForm.get('nombre')?.enable();
    }

    this.editMode = false;
    this.currentAppointmentId = null;
  }

  changeAppointmentStatus(id: number, estado: 'pending' | 'confirmed' | 'cancelled' | 'completed'): void {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments[index].estado = estado;
      this.saveAppointments();
    }
  }

  formatDateForInput(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getFilteredAppointments(): Appointment[] {
    if (this.filterStatus === 'all') {
      return this.appointments;
    }
    return this.appointments.filter(appointment => appointment.estado === this.filterStatus);
  }

  sortAppointmentsByDate(): void {
    this.appointments.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    this.saveAppointments();
  }

  getStatusLabel(estado: string): string {
    switch (estado) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return estado;
    }
  }
}
