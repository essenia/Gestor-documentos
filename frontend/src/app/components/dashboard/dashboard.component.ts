import { Component, OnInit  } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { Cliente } from '../../interfaces/cliente';
import { ClientService } from '../../services/client.service';



interface Persona {
  nombre: string;
  apellido: string;
  estado?: string; // Opcional para clientes
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NavbarComponent, CommonModule,
    FormsModule,
    RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
   rolUsuario: string = ''; //  aquí se guarda el rol actual

    totalClientes = 0;
  totalAbogadas = 0;
  casosActivos = 0;
  nuevosClientes = 0;
  ultimosClientes: Cliente[] = [];

  ultimasAbogadas: Persona[] = [];

  constructor(private auth: AuthServiceService,private usuariosService: ClientService) {}

  ngOnInit(): void {
    this.rolUsuario = this.auth.getRol(); // obtiene el rol del usuario logueado
    console.log('ROL:', this.rolUsuario); //  sirve para debug
        // this.cargarUltimosClientes();


  }

  // ngOnInit() {
    // Datos de ejemplo; reemplazar con tu API
    // this.totalClientes = 10;
    // this.totalAbogadas = 3;
    // this.casosActivos = 5;
    // this.nuevosClientes = 2;

    
    
    
    
  //   cargarUltimosClientes() {
  //   this.usuariosService.getUltimosClientes().subscribe(
  //     clientes => {
  //       this.ultimosClientes = clientes;
  //       this.totalClientes = clientes.length; // puedes hacer otro endpoint para total real
  //     },
  //     err => console.error(err)
  //   );
   }

    




  