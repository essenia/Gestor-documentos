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


@Component({
  selector: 'app-add-edit-cliente',
  imports: [CommonModule,RouterModule,FormsModule,SpinnerComponent],
  templateUrl: './add-edit-cliente.component.html',
  styleUrl: './add-edit-cliente.component.css'
})
export class AddEditClienteComponent implements  OnInit {

// @Input() clienteId?: number; // si existe, es edición
// isEdit = false;
//   loading = false;

//  cliente: Cliente = {
//     id_usuario: 0,
//     nombre: '',
//     apellido: '',
//     dni: '',
//     tipo_dni: 'DNI',
//     activo: true
//   };


//    mensaje = '';
//   error = '';
//   constructor(private clienteService : ClientService, private router: Router, private toastr: ToastrService,
//     private errorService: ErrorService) {}

//    ngOnInit(): void {
//     if (this.clienteId) {
//       this.isEdit = true;
//       this.cargarCliente();
//     }
//   }
//   //  ngOnInit(): void {
//   //   const id = this.route.snapshot.paramMap.get('id');
//   //   if (id) {
//   //     this.isEdit = true;
//   //     this.cargarCliente(id);
//   //   }
//   // }
//  cargarCliente() {
//     this.loading = true;

//     this.clienteService.getClienteById(this.clienteId!)
//       .subscribe({
//         next: (res) => {
//           this.loading = false;
//           this.cliente = res;
//         },
//         error: (e: HttpErrorResponse) => {
//           this.loading = false;
//           this.errorService.msjError(e);
//         }
//       });
//   }

//   guardarCliente() {
//     // validaciones básicas
//     if (!this.cliente.nombre || !this.cliente.apellido || !this.cliente.dni) {
//       this.toastr.error('Los campos obligatorios no pueden estar vacíos', 'Error');
//       return;
//     }

//     this.loading = true;

//     if (this.isEdit) {
//       this.clienteService.actualizarCliente(this.clienteId!, this.cliente)
//         .subscribe({
//           next: () => {
//             this.loading = false;
//             this.toastr.success('Cliente actualizado correctamente', 'Éxito');
//           },
//           error: (e: HttpErrorResponse) => {
//             this.loading = false;
//             this.errorService.msjError(e);
//           }
//         });
//     } else {
//       this.clienteService.crearCliente(this.cliente)
//         .subscribe({
//           next: () => {
//             this.loading = false;
//             this.toastr.success('Cliente creado correctamente', 'Éxito');
//             this.resetFormulario();
//           },
//           error: (e: HttpErrorResponse) => {
//             this.loading = false;
//             this.errorService.msjError(e);
//           }
//         });
//     }
//   }

//   resetFormulario() {
//     this.cliente = {
//       id_usuario: 0,
//       nombre: '',
//       apellido: '',
//       dni: '',
//       tipo_dni: 'DNI',
//       activo: true
//     };
//   }
// }


  cliente: any = {};
  isEdit: boolean = false;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClientService,
    private toastr: ToastrService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarCliente(+id);
    }
  }

  cargarCliente(id: number) {
    this.loading = true;
    this.clienteService.getClienteById(id).subscribe({
      next: (res) => {
        this.cliente = res;
            // normalizar tipo_dni
      if (this.cliente.tipo_dni) {
        this.cliente.tipo_dni = this.cliente.tipo_dni.trim().toUpperCase();
      }
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this.errorService.msjError(e);
      }
    });
  }

  guardarCliente() {
    this.loading = true;

    if (this.isEdit) {
      //  ACTUALIZAR
      this.clienteService.actualizarCliente(this.cliente.id, this.cliente).subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success('Cliente actualizado correctamente');
          this.router.navigate(['/clientes']);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.errorService.msjError(e);
        }
      });

    } else {
      //  CREAR
      this.clienteService.crearCliente(this.cliente).subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success('Cliente creado correctamente');
          this.router.navigate(['/clientes']);
        },
        error: (e: HttpErrorResponse) => {
          this.loading = false;
          this.errorService.msjError(e);
        }
      });
    }
  }
}