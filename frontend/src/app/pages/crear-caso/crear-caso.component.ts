import { Component,OnInit } from '@angular/core';
import { CasoService } from '../../services/caso.service';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../interfaces/cliente';
import { TipoTramite } from '../../interfaces/tipoTramite';
import { Caso } from '../../interfaces/caso';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crear-caso',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './crear-caso.component.html',
  styleUrl: './crear-caso.component.css'
})
export class CrearCasoComponent implements OnInit{
//  idCaso!: number;
//   documentos: any[] = [];

 clientes: Cliente[] = [];
  tramites: TipoTramite[] = [];
  clienteSeleccionado!: number;
  tramiteSeleccionado!: number;

  constructor(
    private clientService: ClientService,
    private casoService: CasoService,
    private router: Router
  ) {}





  // ngOnInit(): void {
  //   this.idCaso = Number(this.route.snapshot.paramMap.get('id'));
  //   this.cargarDocumentos();
  // }

    
  ngOnInit(): void {
    // Cargar lista de clientes
    this.clientService.getClientes().subscribe(res => {
      this.clientes = res;
    });

    // Cargar lista de tipos de trámite
    this.casoService.getTramites().subscribe(res => {
      this.tramites = res;
    });
  }
//    crearCaso() {
//   if (this.clienteSeleccionado && this.tramiteSeleccionado) {
//     this.casoService.crearCaso(this.clienteSeleccionado, this.tramiteSeleccionado)
//       .subscribe((res: any) => {
//         console.log('Caso creado:', res);

//         // Accedemos correctamente al ID
//         const idCaso = res.caso.id;

//         // Redirigimos a la vista de documentos del caso
//         this.router.navigate(['/casos', idCaso, 'documentos']);
        
//       }, err => {
//         console.error('Error al crear caso:', err);
//       });
//   }
// }
crearCaso() {

  // Validación cliente
  if (!this.clienteSeleccionado) {
    Swal.fire({
      icon: 'warning',
      title: 'Falta seleccionar cliente',
      text: 'Debe seleccionar un cliente para crear el caso'
    });
    return;
  }

  //  Validación trámite
  if (!this.tramiteSeleccionado) {
    Swal.fire({
      icon: 'warning',
      title: 'Falta seleccionar trámite',
      text: 'Debe seleccionar un tipo de trámite'
    });
    return;
  }

  // Obtener nombres 
  const cliente = this.clientes.find(c => c.id == this.clienteSeleccionado);
  const tramite = this.tramites.find(t => t.id == this.tramiteSeleccionado);

  const nombreCliente = cliente 
    ? `${cliente.nombre} ${cliente.apellido}` 
    : '';

  const nombreTramite = tramite 
    ? tramite.descripcion 
    : '';

  //  Confirmación antes de crear
  Swal.fire({
    title: '¿Crear caso?',
    html: `
      <b>Cliente:</b> ${nombreCliente} <br>
      <b>Trámite:</b> ${nombreTramite}
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, crear',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {

      this.casoService
        .crearCaso(this.clienteSeleccionado, this.tramiteSeleccionado)
        .subscribe({
          next: (res: any) => {

            const idCaso = res.caso.id;

            //  Mensaje éxito
            Swal.fire({
              icon: 'success',
              title: 'Caso creado correctamente',
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              // Redirigir a documentos
              this.router.navigate(['/casos', idCaso, 'documentos']);
            });

          },
          error: (err) => {
            console.error('Error al crear caso:', err);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear el caso'
            });
          }
        });

    }
  });
}

}





 


//  crearCaso() {
//     if (!this.selectedClienteId || !this.selectedTramiteId) {
//       this.mensaje = 'Por favor selecciona cliente y tipo de trámite.';
//       return;
//     }

//     this.cargando = true;
//     this.casoService.crearCaso(this.selectedClienteId, this.selectedTramiteId).subscribe({
//       next: (casoCreado: Caso) => {
//         console.log('Caso creado:', casoCreado);
//         this.mensaje = 'Caso creado correctamente ✅';
//         // Redirige a la página de documentos
//         this.router.navigate([`/casos/${casoCreado.id}/documentos`]);
//       },
//       error: (err) => {
//         console.error('Error al crear caso:', err);
//         this.mensaje = 'Error al crear el caso ❌';
//         this.cargando = false;
//       }
//     });
//   }
