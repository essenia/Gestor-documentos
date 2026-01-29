import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa RouterLink y RouterModule para navegar entre rutas
import { RouterLink, RouterModule } from '@angular/router';
// Importa las directivas NgForOf y NgIf desde Angular
import { NgForOf, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Importa ToastrService para mostrar notificaciones (mensajes de alerta)
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
// Importa un componente Spinner para mostrar una animación de carga
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
// Importa HttpErrorResponse para manejar errores de peticiones HTTP
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";


@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, RouterLink, FormsModule, SpinnerComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  rol: string = '';
  confirmPassword: string = '';
  // Variable para controlar la animación de carga
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService: UserService,
    private router: Router, private _errorService : ErrorService,    private route: ActivatedRoute) {}

  id_rol!: number;

 ngOnInit(): void {
  const rol = this.route.snapshot.queryParamMap.get('rol'); // 'ABOGADA' o 'CLIENTE'

    // if (rol === 'ADMIN') this.id_rol = 1;

  if (rol === 'ABOGADA') this.id_rol = 2;
  if (rol === 'CLIENTE') this.id_rol = 3;
}
  addUser() {
    //validare que el usuario ingrese valores
    if (this.email == '' || this.password == '' || this.confirmPassword == '') {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
    }
    // Validar que las contraseñas coincidan
    if (this.password != this.confirmPassword) {
      this.toastr.error('las password ingresadas son distintas', 'Error');
      return;
    }
    // Crear un objeto user con los datos ingresados
    const user: User = {
      email: this.email,
      password: this.password,
      repeatPassword: this.confirmPassword, // ✅ necesario para el backend
      id_rol: this.id_rol   // 🔹 rol asignado automáticamente

    };
    console.log('Usuario a enviar:', user);
    // Activar el spinner de carga
    this.loading = true;
    // Llamada al servicio para registrar el usuario
    this._userService.signIn(user).subscribe({
      next: (v) => {
        // Si la petición es exitosa
        this.loading = false;
        this.toastr.success(
          'el usuario fue registrado con exito',
          'Usuario registrado',
        );
        this.router.navigate(['/login']);
      },
      error: (e: HttpErrorResponse) => {
        // Si ocurre un error
        this.loading = false;
        this._errorService.msjError(e);
      }
      // Mensaje cuando la suscripción finaliza
      // complete: () => console.info('complete'),
    });
  }
  // msjError(e: HttpErrorResponse) {
  //     const message = e.error.msg || e.error.message; // revisa ambos campos

  //   if (message) {
  //   this.toastr.error(message, 'Error');
  //   } else {
  //     this.toastr.error(
  //       'upps occurio un error comuniquese con el administrador ',
  //       'Error',
  //     );
  //   }
  // }
}
