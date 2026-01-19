import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';


import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

import { User } from '../../interfaces/user';

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
@Component({
  selector: 'app-change-password',
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {


   password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    private _userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}
   changePassword() {
    // if (this.password === '' || this.confirmPassword === '') {
    //   this.toastr.error('Todos los campos son obligatorios');
    //   return;
    // }
    // if (this.password !== this.confirmPassword) {
    //   this.toastr.error('Las contraseñas no coinciden');
    //   return;
    // }

 this.loading = true;

    const userId = Number(localStorage.getItem('userId')); // del login
  const newPassword = this.password;

  this._userService.changePassword(userId, newPassword).subscribe({
    next: () => {
      this.loading = false;
      
      this.toastr.success('Contraseña actualizada');
      this.router.navigate(['/dashboard']); // Redirige al dashboard
    },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Error al actualizar contraseña');
      }
    });
  }
}
