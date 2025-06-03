import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/registro/registro.component';
import { AppointmentComponent } from './components/citas/citas.component';
import { LoginComponent } from './components/login/login.component';
import { WorkshopComponent} from './components/taller/taller.component';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'appointment', component: AppointmentComponent },
  { path: 'login', component: LoginComponent },
  { path: 'workshop', component: WorkshopComponent },
  
];

