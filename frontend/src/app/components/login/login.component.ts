import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';

import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule,SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    email: string = '';
  password: string = '';
    loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService: UserService,private router: Router,
  private _errorService : ErrorService) {}

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
    next: (res: any) =>{
            localStorage.setItem('token',res.token);
      this.router.navigate(['/dashboard'])
   console.log(res.token);

    },
    error: (e: HttpErrorResponse) => {
        // Si ocurre un error
        this._errorService.msjError(e);
        this.loading = false;
      }

      })

    }
    
}
