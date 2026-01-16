import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,RouterModule } from '@angular/router';
import {  NgForOf, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  email :string = '';
  password : string = ''
  rol : string = '';
  confirmPassword : string = ''

  loading : boolean = false;

constructor(private toastr: ToastrService,private _userService: UserService,private router:Router) {}

  
  ngOnInit(): void {
 
  }
addUser(){
//validare que el usuario ingrese valores
if(this.email == '' || this.password == '' ||this.confirmPassword ==''){
  this.toastr.error('Todos los campos son obligatorios', 'Error');

}
if(this.password != this.confirmPassword){
    this.toastr.error('las password ingresadas son distintas', 'Error');
  return;
}
const user : User = {
 email :this.email,
 password: this.password
}
this.loading = true;
this._userService.signIn(user).subscribe(data => {
    this.loading = false;
    this.toastr.success('el usuario fue registrado con exito', 'Usuario registrado');
this.router.navigate(['/login']);

},(event : HttpErrorResponse) => { 
   this.loading =  false;
   if(event.error.msg){
     this.toastr.error(event.error.msg, 'Error')

   }else{
      this.toastr.error('upps occurio un error comuniquese con el administrador ', 'Error')

   }
  
 }
)
}
}



