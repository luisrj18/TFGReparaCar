import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule,RouterLink,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);  // Inyección del servicio de navegación
  cliente :any;
  Constructor(
  ) {}

 // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    let cliente = JSON.parse(localStorage.getItem('cliente')!);
    console.log(cliente)
    if(cliente){this.cliente=cliente}
  }

  // Método para cerrar sesión
  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  }
}

