import { Component,OnInit } from '@angular/core';
import { CasoService } from '../../services/caso.service';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../interfaces/cliente';
import { TipoTramite } from '../../interfaces/tipoTramite';
import { Caso } from '../../interfaces/caso';

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
   crearCaso() {
  if (this.clienteSeleccionado && this.tramiteSeleccionado) {
    this.casoService.crearCaso(this.clienteSeleccionado, this.tramiteSeleccionado)
      .subscribe((res: any) => {
        console.log('Caso creado:', res);

        // Accedemos correctamente al ID
        const idCaso = res.caso.id;

        // Redirigimos a la vista de documentos del caso
        this.router.navigate(['/casos', idCaso, 'documentos']);
        
      }, err => {
        console.error('Error al crear caso:', err);
      });
  }
}

}

// crearCaso() {
//   if (!this.clienteSeleccionado || !this.tramiteSeleccionado) {
//     return;
//   }

//   //  Buscar cliente seleccionado
//   const cliente = this.clientes.find(
//     c => c.id === this.clienteSeleccionado
//   );

//   // Buscar trámite seleccionado
//   const tramite = this.tramites.find(
//     t => t.id === this.tramiteSeleccionado
//   );

//   const clienteNombre = cliente
//     ? `${cliente.nombre} ${cliente.apellido}`
//     : '';

//   const tramiteNombre = tramite
//     ? tramite.descripcion
//     : '';

//   this.casoService
//     .crearCaso(this.clienteSeleccionado, this.tramiteSeleccionado)
//     .subscribe((res: any) => {

//       const idCaso = res.caso.id;

//       //  PASAMOS LOS NOMBRES
//       this.router.navigate(
//         ['/casos', idCaso, 'documentos'],
//         {
//           state: {
//             clienteNombre,
//             tramiteNombre
//           }
//         }
//       );
//     }, err => {
//       console.error('Error al crear caso:', err);
//     });
// }
// }

  // cargarDocumentos() {
  //   this.casoService.getDocumentosCaso(this.idCaso)
  //     .subscribe((res: any) => this.documentos = res.documentos);
  // }

//    clientes: any[] = [];
//   tramites: any[] = [];
//   clienteId!: number;
//   tramiteId!: number;

//     constructor(
//     private clienteService: ClientService,
//     private casoService: CasoService,
//     private router: Router
//   ) {}
//   //Método que se ejecuta cuando el componente se carga.
  //  ngOnInit() {
  //   this.clienteService.getClientes().subscribe(res => this.clientes = res);
  //   this.casoService.getTramites().subscribe(res => this.tramites = res);
  // }
  //  crearCaso() {
  //   //subscribe recibe la respuesta del backend
  //   this.casoService.crearCaso(this.clienteId, this.tramiteId)
  //     .subscribe(res => {
  //       //Redirige al usuario a otra ruta.
  //       this.router.navigate(['/casos', res.caso.id, 'documentos']);
  //     });
  // }



 


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
