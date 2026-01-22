import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  rolUsuario: string = '';

  constructor(private router: Router, private auth :AuthServiceService) {}
  // ngOnInit(): void {
  //   this.rolUsuario = localStorage.getItem('rol') || '';
  // }


   ngOnInit(): void {
    this.rolUsuario = this.auth.getRol(); //  Aquí obtenemos el rol
  }
  logout() {
    localStorage.clear(); // borra token y rol
    this.router.navigate(['/login']);
  }
}
