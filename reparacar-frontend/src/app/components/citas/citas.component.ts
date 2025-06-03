import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Interfaz que define la estructura de una cita
interface Appointment {
  nombre: any;
  id: number;
  modeloVehiculo: string;
  matricula: string;
  fecha: Date;
  hora: string;
  servicio: string;
  descripcion: string;
  estado: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  cliente_id?: number;
  taller_id: number;
  nombreTitular: string;
  nombreTaller:string;
}

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink, ReactiveFormsModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class AppointmentComponent implements OnInit {
  private http = inject(HttpClient);  // Inyección del servicio HttpClient
  appointments: Appointment[] = [];
  appointmentForm!: FormGroup;
  editMode = false;
  currentAppointmentId: number | null = null;
  filterStatus: string = 'all';
  private baseUrl = 'http://localhost:8080/api/citas';  // URL base para API de citas
  private baseUrlTaller = 'http://localhost:8080/api/talleres';  // URL base para talleres
  clienteId: number | null = null;
  cliente: any
  taller:any;
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
  talleres: any;
  horasDisponibles: string[] = [];

  generarHorasDisponibles(): void {
    const horas: string[] = [];

    // Tramo de la mañana: 09:00 a 13:30
    for (let h = 9; h <= 13; h++) {
      horas.push(`${this.pad(h)}:00`);
      if (h < 13 || h === 13) horas.push(`${this.pad(h)}:30`);
    }

    // Tramo de la tarde: 16:00 a 18:30
    for (let h = 16; h <= 18; h++) {
      horas.push(`${this.pad(h)}:00`);
      if (h < 18 || h === 18) horas.push(`${this.pad(h)}:30`);
    }

    this.horasDisponibles = horas;
  }

  private pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  onFechaChange(fechaSeleccionada: string): void {
    const fecha = new Date(fechaSeleccionada);
    const dia = fecha.getDay(); // 0 = domingo, 6 = sábado

    // Si es sábado (6) o domingo (0)
    if (dia === 0 || dia === 6) {
      this.horasDisponibles = []; // Limpiamos las horas disponibles
      this.appointmentForm.get('hora')?.setValue(''); // Limpiamos selección previa
    } else {
      this.generarHorasDisponibles(); // Volvemos a cargar horas si es día laborable
    }
  }
  onFechaInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onFechaChange(input.value); // Llama a tu lógica existente
  }


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadAppointments();  // Cargar citas desde localStorage
    this.generarHorasDisponibles();
    this.loadTaller();
    this.loadCitasDelTaller();

    // Cargar cliente o taller desde localStorage
    this.cliente = JSON.parse(localStorage.getItem('cliente')!);
    this.taller = JSON.parse(localStorage.getItem('taller')!);
    if (this.cliente) {
      this.clienteId = this.cliente.id;
      this.loadCitasDelCliente(); // Si es cliente
    } else if (this.taller) {
      this.loadCitasDelTaller(); // Si es taller
    }
  }

  // Carga lista de talleres desde el backend
  loadTaller() {
    this.http.get<any>(this.baseUrlTaller).subscribe({
      next: (response) => {
        this.talleres = response
      },
      error: (error) => {
        console.error('Error en login', error);

      }
    });
  }

  // Inicializa el formulario con validadores
  initForm(): void {
    this.appointmentForm = this.fb.group({
      taller_id: [null, Validators.required],
      modeloVehiculo: ['', Validators.required],
      matricula: ['', [Validators.required, Validators.pattern('[0-9A-Za-z]{1,7}')]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      servicio: ['', Validators.required],
      descripcion: [''],
      estado: ['pending', Validators.required]
    });
  }
  // Guarda citas y talleres en localStorage
  saveAppointments(): void {
    localStorage.setItem('repara-car-appointments', JSON.stringify(this.appointments));
    localStorage.setItem('taller', JSON.stringify(this.talleres));
  
  }
  // Carga citas guardadas localmente
  loadAppointments(): void {
    const savedAppointments = localStorage.getItem('repara-car-appointments');
    if (savedAppointments) {
      this.appointments = JSON.parse(savedAppointments).map((appointment: any) => ({
        ...appointment,
        fecha: new Date(appointment.fecha)
      }));
    }
  }
  // Crea o actualiza una cita y la envía al backend
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
      cliente_id: cliente ? cliente.id : null,
      nombre: cliente ? cliente.nombre : 'No especificado'
    };

    // Si se está editando una cita existente
    if (this.editMode && this.currentAppointmentId !== null) {
      const index = this.appointments.findIndex(a => a.id === this.currentAppointmentId);
      if (index !== -1) {
        this.appointments[index] = {
          ...this.appointments[index],
          ...citaData
        };
      }
    } else {
      // Nueva cita
      const newAppointment: Appointment = {
        id: Date.now(),
        ...citaData,
        fecha: new Date(formValues.fecha)
      };
      this.appointments.push(newAppointment);
    }

    this.http.post<any>(this.baseUrl, citaData).subscribe({
      next: (response) => {

      },
      error: (error) => {
        console.error('Error en login', error);

      }
    });

    this.saveAppointments();
    this.resetForm();
  }


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Carga una cita en el formulario para su edición
  editAppointment(appointment: Appointment): void {
    this.editMode = true;
    this.currentAppointmentId = appointment.id;

    const formattedDate = this.formatDateForInput(appointment.fecha);

    this.appointmentForm.patchValue({
      taller_id: appointment.taller_id,
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

  // Elimina una cita por ID
  deleteAppointment(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      this.appointments = this.appointments.filter(appointment => appointment.id !== id);
      this.saveAppointments();
    }
  }

  // Limpia el formulario y reinicia modo edición
  resetForm(): void {
    this.appointmentForm.reset({
      estado: 'pending'
    });

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

      // Ordena las citas por fecha
  sortAppointmentsByDate(): void {
        this.appointments.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
        this.saveAppointments();
      }

  // Carga las citas del taller desde el backend    
  loadCitasDelTaller(): void {
        const taller = JSON.parse(localStorage.getItem('cliente')!);
        if (!taller) return;

        this.http.get<Appointment[]>(`${this.baseUrl}/buscar/taller?tallerId=${taller.id}`).subscribe({
          next: (response) => {
            this.appointments = response.map(cita => ({
              ...cita,
              fecha: new Date(cita.fecha),
              nombreTitular: cita?.nombre
            }));
          },
          error: (error) => {
            console.error('Error al cargar citas del taller:', error);
          }
        });
      }
      
  // Carga las citas del cliente desde el backend    
  loadCitasDelCliente(): void {
        const cliente = JSON.parse(localStorage.getItem('cliente')!);
        if (!cliente) return;

       this.http.get<Appointment[]>(`${this.baseUrl}/buscar/cliente?clienteId=${cliente.id}`).subscribe({
        next: (response) => {
         this.appointments = response.map(cita => ({
          ...cita,
          fecha: new Date(cita.fecha)
        }));
    },
    error: (error) => {
      console.error('Error al cargar citas del cliente:', error);
    }
  });
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
