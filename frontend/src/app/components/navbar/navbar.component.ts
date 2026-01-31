import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, FormsModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  rolUsuario: string = '';

  sidebarOculto = false; 

  nombreUsuario = 'Usuario';
  fotoPerfil = 'https://i.pravatar.cc/150?img=5';

  notificaciones = 3;
  listaNotificaciones = [
    'Nuevo cliente registrado',
    'Cita mañana a las 10am',
    'Documento pendiente'
  ];

perfilAbierto = false;



  constructor(private router: Router, private auth :AuthServiceService) {}
  // ngOnInit(): void {
  //   this.rolUsuario = localStorage.getItem('rol') || '';
  // }


   ngOnInit(): void {
    this.rolUsuario = this.auth.getRol(); //  Aquí obtenemos el rol

  }

//
  toggleSidebar() {
    this.sidebarOculto = !this.sidebarOculto;
  }
  togglePerfil() {
  this.perfilAbierto = !this.perfilAbierto;
}
  logout() {
    localStorage.clear(); // borra token y rol
    this.router.navigate(['/login']);
  }
}
