 import { Component, OnInit, Input} from '@angular/core';


import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../../../interfaces/cliente';
import { ClientService } from '../../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../services/error.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-add-edit-cliente',
  imports: [CommonModule,RouterModule,FormsModule,SpinnerComponent],
  templateUrl: './add-edit-cliente.component.html',
  styleUrl: './add-edit-cliente.component.css'
})
export class AddEditClienteComponent implements  OnInit {




 cliente: Cliente = {
   nombre: '',
   apellido: '',
   dni: '',
   tipo_dni: 'DNI',
   activo: true,
   
  
 };

  usuario: User = {
    email: '',
    password: '',
    repeatPassword: ''
  };
 

  // cliente: any = {};
  isEdit: boolean = false;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClientService,
    private userService: UserService,
    private toastr: ToastrService,
    private errorService: ErrorService
  ) {}



  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id) {
  //     this.isEdit = true;
  //     this.cargarCliente(+id);
  //   }
  // }

   ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarCliente(+id);
    }
  }

  // cargarCliente(id: number) {
  //   this.loading = true;
  //   this.clienteService.getClienteById(id).subscribe({
  //     next: (res) => {
  //       this.cliente = res;
  //           // normalizar tipo_dni
  //     if (this.cliente.tipo_dni) {
  //       this.cliente.tipo_dni = this.cliente.tipo_dni.trim().toUpperCase();
  //     }
  //       this.loading = false;
  //     },
  //     error: (e: HttpErrorResponse) => {
  //       this.loading = false;
  //       this.errorService.msjError(e);
  //     }
  //   });
  // }

    cargarCliente(id: number) {
    this.loading = true;
    this.clienteService.getClienteById(id).subscribe({
      // next: (res) => {
      //   this.cliente = res;
    next: (res) => {
        this.cliente = res;
 if (res.usuario) {
        this.usuario = {
          id: res.usuario.id,
          email: res.usuario.email,
          password: '',
          repeatPassword: ''
        };
      }
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.errorService.msjError(e);
      }
    });
  }

//   guardarCliente() {
//     this.loading = true;

//     if (this.isEdit) {
//       //  ACTUALIZAR
//       this.clienteService.actualizarCliente(this.cliente.id, this.cliente).subscribe({
//         next: () => {
//           this.loading = false;
//           this.toastr.success('Cliente actualizado correctamente');
//           this.router.navigate(['/clientes']);
//         },
//         error: (e: HttpErrorResponse) => {
//           this.loading = false;
//           this.errorService.msjError(e);
//         }
//       });

//     } else {
//       //  CREAR
//       this.clienteService.crearCliente(this.cliente).subscribe({
//         next: () => {
//           this.loading = false;
//           this.toastr.success('Cliente creado correctamente');
//           this.router.navigate(['/clientes']);
//         },
//         error: (e: HttpErrorResponse) => {
//           this.loading = false;
//           this.errorService.msjError(e);
//         }
//       });
//     }
//   }
// }

guardarCliente() {
  // 1️⃣ Validar que las contraseñas coincidan (solo si estamos creando)
  if (!this.isEdit && this.usuario.password !== this.usuario.repeatPassword) {
    this.toastr.error('Las contraseñas no coinciden');
    return;
  }

  this.loading = true;

  if (this.isEdit) {
    // EDITAR CLIENTE
    this.clienteService.actualizarCliente(this.cliente.id!, this.cliente).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Cliente actualizado correctamente');
        this.router.navigate(['/clientes']);
      },
      error: (e) => {
        this.loading = false;
        this.errorService.msjError(e);
      }
    });
  } else {
    // CREAR CLIENTE NUEVO

    // 🔹 1. Asegurarse de que id_rol esté asignado
    this.usuario.id_rol = 3; // 3 = CLIENTE

    // 🔹 2. Crear usuario primero
    this.userService.signIn(this.usuario).subscribe({
      next: (resUsuario: any) => {
            console.log('Usuario creado:', resUsuario); // debe mostrar { id: 80, email: ... }

        // 🔹 3. Asignar id_usuario al cliente
        this.cliente.id_usuario = resUsuario.id;


    console.log('Cliente a enviar:', this.cliente); // Para verificar
        // 🔹 4. Crear cliente
        this.clienteService.crearCliente(this.cliente).subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success('Cliente y usuario creados correctamente');
            this.router.navigate(['/clientes']);
          },
          error: (e) => {
            this.loading = false;
            this.errorService.msjError(e);
          }
        });
      },
      error: (e) => {
        this.loading = false;
        this.errorService.msjError(e);
      }
    });
  }
}
}