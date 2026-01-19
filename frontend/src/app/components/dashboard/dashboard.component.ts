import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NavbarComponent, CommonModule,
    FormsModule,
    RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
   rolUsuario: string = ''; // ← aquí se guarda el rol actual

  constructor(private auth: AuthServiceService) {}

  ngOnInit(): void {
    this.rolUsuario = this.auth.getRol(); // ← obtiene el rol del usuario logueado
    console.log('ROL:', this.rolUsuario); // <- sirve para debug
  }


}
