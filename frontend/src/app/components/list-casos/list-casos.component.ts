import { Component, OnInit } from '@angular/core';
import { CasoService } from '../../services/caso.service';
import { Caso } from '../../interfaces/caso';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Cliente } from '../../interfaces/cliente';
import { TipoTramite } from '../../interfaces/tipoTramite';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../services/error.service';



@Component({
  selector: 'app-list-casos',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-casos.component.html',
  styleUrl: './list-casos.component.css'
})
export class ListCasosComponent  implements OnInit{

mostrarModalVer: boolean = false;
casoSeleccionado: Caso | null = null;


  mostrarModalHistorial: boolean = false;
historialEstados: any[] = [];

   casos: Caso[] = [];  // ahora tipado correctamente
  loading = true;
  historial: any[] = [];
historialCaso: Caso | null = null;
//  historialCaso: Caso | null = null;
// historial: HistorialEstado[] = [];
  casosFiltrados: Caso[] = [];

  // Filtros
  filtroEstado = '';
  textoBuscar = '';
   // Paginación
  currentPage = 1;
  pageSize = 7;
  totalPages = 1;
  pages: number[] = [];
  paginatedCasos: Caso[] = [];

  historialVisible = false;
  // casoSeleccionado: any;
  // Modal de edición
editarModalVisible = false;
 // copia del caso que vamos a editar
casoEditar: Caso | null = null;




  
  constructor(private casoService: CasoService,  private toastr: ToastrService, private _errorService : ErrorService) {}
 ngOnInit(): void {
    this.cargarCasos();
  }

 // Cargar casos desde el servicio
   cargarCasos(): void {
    this.loading = true;
    this.casoService.getCasos().subscribe({
      next: (res: any) => {
        if (res.ok) {
          this.casos = res.casos;
          this.casosFiltrados = [...this.casos];
          this.ordenarCasos();
          this.updatePagination();
        }
      },
      error: (err) => console.error('Error al cargar casos', err),
      complete: () => this.loading = false
    });
  }
ordenarCasos(): void {
  this.casosFiltrados.sort((a, b) =>
    (a.cliente?.nombre ?? '')
      .toLowerCase()
      .localeCompare((b.cliente?.nombre ?? '').toLowerCase())
  );
}
  // Filtros y búsqueda
  aplicarFiltros(): void {
    const texto = this.textoBuscar.trim().toLowerCase();

    this.casosFiltrados = this.casos.filter(caso => {
      const coincideEstado = !this.filtroEstado || caso.estado === this.filtroEstado;
      const coincideTexto = !texto ||
        caso.cliente?.nombre?.toLowerCase().includes(texto) ||
        caso.cliente?.apellido?.toLowerCase().includes(texto) ||
        caso.num_expediente?.toLowerCase().includes(texto) ||
        caso.cod_caso?.toLowerCase().includes(texto);
      return coincideEstado && coincideTexto;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  // Badge dinámico según estado
  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'pendiente_documentos': return 'badge bg-warning';
      case 'en_tramite': return 'badge bg-primary';
      case 'finalizado': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  // Paginación
  updatePagination(): void {
    this.totalPages = Math.ceil(this.casosFiltrados.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCasos = this.casosFiltrados.slice(start, end);
  }

  goToPage(page: number, event: Event) {
    event.preventDefault();
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage(event: Event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(event: Event) {
    event.preventDefault();
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  // Acciones opcionales
 verCaso(caso: Caso): void {
  this.casoSeleccionado = caso;
  this.mostrarModalVer = true;
}
//cerrar ModVer
cerrarModalVer(): void {
  this.mostrarModalVer = false;
  this.casoSeleccionado = null;
}


  editarCaso(caso: Caso) {
    console.log('Editar caso:', caso);
  }

  // Abrir modal de edición

// abrirModalEditar(caso: Caso): void {
//   this.casoEditar = { ...caso };// hacemos copia para no afectar tabla
//   this.editarModalVisible = true;
// }
abrirModalEditar(caso: Caso): void {
  this.casoEditar = { 
    ...caso,
     cliente: caso.cliente || { nombre: '', apellido: '' } as Cliente,
    tipoTramite: caso.tipoTramite || { descripcion: '' } as TipoTramite
  };
  this.editarModalVisible = true;
}

// Cerrar modal de edición
cerrarModalEditar() {
  this.editarModalVisible = false;
  this.casoEditar = null;
}


// Guardar cambios
// guardarCambios() {
//   if (!this.casoEditar) return;

//   this.casoService.actualizarCaso(this.casoEditar.id, this.casoEditar)
//     .subscribe({
//       next: (res) => {
//         alert('Caso actualizado correctamente');
//         this.cargarCasos(); // recarga tabla
//         this.cerrarModalEditar();
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Error al actualizar caso');
//       }
//     });
// }

guardarCambios() {
if (!this.casoEditar) return;
  Swal.fire({
    title: '¿Guardar cambios?',
    text: 'Se actualizarán los datos del caso',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.isConfirmed) {
       if (!this.casoEditar) return; 

  this.casoService.actualizarCaso(this.casoEditar.id, this.casoEditar)

        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: 'Caso actualizado correctamente',
              timer: 2000,
              showConfirmButton: false
            });

            this.cargarCasos();
            this.cerrarModalEditar();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el caso'
            });
          }
        });

    }

  });
}
//   cambiarEstado(caso: Caso, event: any) {
//   const nuevoEstado = event.target.value;

//   this.casoService.actualizarEstado(caso.id!, nuevoEstado)
//     .subscribe({
//       next: () => {
//         caso.estado = nuevoEstado;
//       },
//       error: () => {
//         alert('Error al actualizar estado');
//       }
//     });
// }
// cambiarEstado(caso: Caso, event: any) {
//   const nuevoEstado = event.target.value;

//   console.log('ID:', caso.id);
//   console.log('ESTADO:', nuevoEstado);

//   this.casoService.actualizarEstado(caso.id!, nuevoEstado)
//     .subscribe({
//       next: (res) => {
//         console.log('RESPUESTA OK:', res);
//         caso.estado = nuevoEstado;
//       },
//       error: (err) => {
//         console.error('ERROR BACKEND:', err);
//         alert('Error al actualizar estado');
//       }
//     });
// }



cambiarEstado(caso: Caso) {
  this.casoService.actualizarEstado(caso.id!, caso.estado)
    .subscribe({
      next: () => {
        this.toastr.success('Estado actualizado correctamente');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al actualizar estado');
      }
    });
}


verHistorial(caso: Caso) {
  console.log('CLICK HISTORIAL', caso); // 👈 prueba

  this.historialCaso = caso;

  this.casoService.getHistorial(caso.id).subscribe({
    next: (resp) => {
      console.log('RESPUESTA HISTORIAL', resp); // 👈 prueba

      if (resp.ok) {
        this.historial = resp.historial;
      }
    },
    error: (err) => console.error(err)
  });
}


cerrarModalHistorial(): void {
  this.mostrarModalHistorial = false;
  this.historialEstados = [];
  this.historialCaso = null;
}

}

