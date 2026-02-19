import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    email: string = '';
  password: string = '';
    loading: boolean = false;
      userId?: number;


  constructor(
    private toastr: ToastrService,
    private _userService: UserService,private router: Router,
  private _errorService : ErrorService, private authService: AuthServiceService ) {}

    ngOnInit(): void {}

    login(){
      if(this.email == '' || this.password == ''){
      this.toastr.error('Todos los campos son obligatorios', 'Error');
   return
      }
      //creamos el Body
    const user: User = {
        email : this.email,
        password : this.password
      }
    this.loading=  true;

      this._userService.login(user).subscribe({
    next: (res: any) => {
      this.loading = false;

      // Cliente obligado a cambiar contraseña
      if (res.requiereCambio) {
        // localStorage.setItem('userId', res.userId);
         this.userId = res.userId;
         localStorage.setItem('userId', res.userId);

              // localStorage.setItem('userId', res.user.id);

        
        this.router.navigate(['/change-password']);
        return;
      }

      // Login normal (admin o abogada)
      this.authService.login(res.token, res.user.rol);
      localStorage.setItem('userId', res.user.id);
      this.router.navigate(['/listusers']);
    },
    error: (e: HttpErrorResponse) => {
      this.loading = false;
      this._errorService.msjError(e);
    }
  });
}}