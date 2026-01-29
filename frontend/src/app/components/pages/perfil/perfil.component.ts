import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../services/auth-service.service';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { Cliente } from '../../../interfaces/cliente';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

 usuario!: User;  // Guardaremos todos los datos del usuario
  fotoPerfil = 'https://i.pravatar.cc/150?img=5';

  constructor(private userService: UserService, private auth: AuthServiceService
) {}

// ngOnInit(): void {
//   const email = this.auth.getUserEmail(); // o localStorage.getItem('email')

//   this.userService.getUsers().subscribe(users => {
//     this.usuario = users.find(u => u.email === email)!;
//   });
// }

ngOnInit(): void {
  const email = this.auth.getUserEmail(); // ahora devuelve el email real
  console.log('Email logueado:', email);

  if (!email) {
    console.warn('No hay usuario logueado, redirigiendo a login...');
    return; // o redirigir al login
  }

  this.userService.getUsers().subscribe(users => {
    this.usuario = users.find(u => u.email === email);
    console.log('Usuario encontrado:', this.usuario);
  });
}



 


 getNombreRol(id?: number): string {
    switch(id) {
      case 1: return 'ADMIN';
      case 2: return 'ABOGADA';
      case 3: return 'CLIENTE';
      default: return 'Desconocido';
    }
  }



}
