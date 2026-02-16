import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../../interfaces/TipoDocumento';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CasoService } from '../../services/caso.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CasoDocumento } from '../../interfaces/caso-documento';
import { CrearDocumentoResponse } from '../../interfaces/crear-documento-response';
import { Cliente } from '../../interfaces/cliente';
import { AddEditClienteComponent } from "../../components/clientes/add-edit-cliente/add-edit-cliente.component";
import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { TipoTramite } from '../../interfaces/tipoTramite';
import { ClientService } from '../../services/client.service';
import { Caso } from '../../interfaces/caso';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-documentos-caso',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './documentos-caso.component.html',
  styleUrl: './documentos-caso.component.css'
})
export class DocumentosCasoComponent implements OnInit{

  idCaso!: number;
  documentos: CasoDocumento[] = [];
  tiposDocumento: TipoDocumento[] = [];

    caso: Caso = {} as Caso;


  // nuevoDoc: { tipo_documento_id: number | null, archivo: File | null } = {
  //   tipo_documento_id: null,
  //   archivo: null
  // };

   nuevoDoc: {
    tipo_documento_id?: number | null,
    nuevo_tipo_nombre?: string,
    nombre: string,
    comentarios?: string,
    es_obligatorio: boolean
  } = {
    nombre: '',
    es_obligatorio: true
  };



   clientes: Cliente[] = [];
    tramites: TipoTramite[] = [];
clienteId!: number;
tramiteId!: number;
clienteNombre = '';
clienteApellido = '';
tramiteDescripcion = '';


  constructor(
    private route: ActivatedRoute,
    private casoService: CasoService,
    private tipoDocumentoService: TipoDocumentoService,
        private clienteService: ClientService,
    private tramiteService: TipoDocumentoService,
  private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    this.idCaso = Number(this.route.snapshot.paramMap.get('id'));
  
    this.cargarDocumentos();
      this.cargarCaso();

    this.cargarTiposDocumento();
  }

  //   cargarCaso() {
  //   this.casoService.getCaso(this.idCaso).subscribe(caso => {
  //     this.clienteNombre = caso.cliente?.nombre || 'Cliente';
  //     this.tramiteNombre = caso.tipoTramite?.descripcion || 'Trámite';


  //   });
  // }

  // documentos-caso.component.ts
isDocumentoCompletado(doc: CasoDocumento): boolean {
  return (doc.estado_validacion || '').toLowerCase() === 'completado';
}

  cargarCaso() {
  this.casoService.getCaso(this.idCaso).subscribe({
    next: (res: any) => {
      const caso = res.caso || res; // depende de tu backend
      this.clienteNombre = caso.cliente?.nombre || 'Cliente';
      this.clienteApellido = caso.cliente?.apellido || '';
      this.tramiteDescripcion = caso.tipoTramite?.descripcion || 'Trámite';
    },
    error: err => console.error('Error cargando caso:', err)
  });
}

cargarDocumentos() {
  this.casoService.getDocumentosCaso(this.idCaso).subscribe({
    next: (res: any) => {
      this.documentos = res.documentos.map((d: any) => ({
        ...d,
        progreso: 0  // ⚡ inicializamos

      }));
    },
    error: (err) => console.error(err)
  });
}


  // cargarDocumentos() {
  //   this.casoService.getDocumentosCaso(this.idCaso).subscribe({
  //     next: (res: any) => {
  //       this.documentos = res.documentos; // ⚡ reemplaza, no concatena
  //     },
  //     error: (err) => console.error(err)
  //   });
  // }

  // Devuelve el nombre completo del cliente por ID
getNombreCliente(idCliente: number): string {
  const c = this.clientes.find(cli => cli.id === idCliente);
  return c ? `${c.nombre} ${c.apellido}` : 'Cliente no encontrado';
}

// Devuelve el nombre del trámite por ID
getNombreTramite(idTramite: number): string {
  const t = this.tramites.find(tr => tr.id === idTramite);
  return t ? t.descripcion : 'Trámite no encontrado';
}


  cargarTiposDocumento() {
    this.tipoDocumentoService.getTiposDocumento().subscribe({
      next: (res: TipoDocumento[]) => this.tiposDocumento = res,
      error: (err) => console.error(err)
    });
  }

  // Subir archivo directamente
  // subirArchivo(event: any, documentoId: number) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   this.casoService.subirDocumento(documentoId, file).subscribe({
  //     next: () => this.cargarDocumentos(),
  //     error: (err) => console.error(err)
  //   });
  // }

  // subirArchivo(event: any, doc: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   doc.progreso = 0;
  //   doc.ruta = '';

  //   this.casoService.subirDocumento(doc.id, file).subscribe({
  //     next: (event: any) => {
  //       if (event.type === HttpEventType.UploadProgress && event.total) {
  //         doc.progreso = Math.round((event.loaded / event.total) * 100);
  //       } else if (event.type === HttpEventType.Response) {
  //         doc.ruta = event.body.ruta;
  //         doc.progreso = 100;
  //       }
  //     },
  //     error: (err) => console.error('Error subiendo archivo:', err)
  //   });
  // }

 // Subir archivo
//  subirArchivo(event: any, doc: CasoDocumento) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const index = this.documentos.indexOf(doc);
//     this.documentos[index].progreso = 0;
//     this.documentos[index].ruta = '';

//     this.casoService.subirDocumento(doc.id, file).subscribe({
//       next: (event: any) => {
//         if (event.type === HttpEventType.UploadProgress && event.total) {
//           this.documentos[index].progreso = Math.round((event.loaded / event.total) * 100);
//           this.cdr.detectChanges();
//         } else if (event.type === HttpEventType.Response) {
//           this.documentos[index].ruta = event.body?.ruta.replace(/^\/?uploads\//, '');
//           this.documentos[index].progreso = 100;
//           this.cdr.detectChanges();
//         }
//       },
//       error: (err) => console.error('Error subiendo archivo:', err)
//     });
//   }


// subirArchivo(event: any, doc: CasoDocumento) {
//   const file = event.target.files[0];
//   if (!file) return;

//   const index = this.documentos.indexOf(doc);
//   this.documentos[index].progreso = 0;

//   this.casoService.subirDocumento(doc.id, file).subscribe({
//     next: (event: any) => {

//       if (event.type === HttpEventType.UploadProgress && event.total) {
//         this.documentos[index].progreso =
//           Math.round((event.loaded / event.total) * 100);
//       }

//       if (event.type === HttpEventType.Response) {
//         // 🔥 AQUÍ ESTABA EL ERROR
//         this.documentos[index].ruta = event.body.documento.ruta;
//         this.documentos[index].progreso = 100;
//       }
//     },
//     error: (err) => console.error('Error subiendo archivo:', err)
//   });
// }
subirArchivo(event: any, doc: CasoDocumento) {
  const file = event.target.files[0];
  if (!file) return;

  // Si ya existe un archivo, eliminarlo primero
  if (doc.ruta) {
    this.casoService.eliminarDocumento(doc.id).subscribe({
      next: () => {
        console.log('Archivo anterior eliminado');
      },
      error: (err) => console.error('Error eliminando archivo anterior:', err)
    });
  }

  // Inicializamos progreso y ruta
  doc.progreso = 0;
  doc.ruta = '';

  // Subir nuevo archivo
  this.casoService.subirDocumento(doc.id, file).subscribe({
    next: (event: any) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        doc.progreso = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
        // doc.ruta = event.body?.documento?.ruta.replace(/^\/?uploads\//, '');
                doc.ruta = event.body?.documento?.ruta || '';

        doc.progreso = 100;
      }
    },
    error: (err) => console.error('Error subiendo archivo:', err)
  });
}


  // Ver documento
  // verDocumento(ruta: string) {
  // window.open(`http://localhost:3000/uploads/${ruta}`, '_blank');
  // }


// verDocumento(doc: CasoDocumento) {
//   if (!doc.ruta) return; // si no hay archivo, no hace nada
//   window.open(this.casoService.getDocumentoURL(doc.ruta), '_blank');
// }

verDocumento(doc: CasoDocumento) {
  if (!doc.id) return;
  window.open(this.casoService.getDocumentoVerURL(doc.id), '_blank');
}

// descargarDocumento(doc: CasoDocumento) {
//   if (!doc.ruta) return;

//   const url = this.casoService.getDocumentoURL(doc.ruta);

//   // Extraemos solo el nombre del archivo
//   const nombreArchivo = doc.ruta.split('/').pop() || 'archivo';

//   const link = document.createElement('a');
//   link.href = url;
//   link.download = nombreArchivo; // nombre seguro
//   link.target = '_blank'; // para algunos navegadores
//   link.click();
// }

descargarDocumento(doc: CasoDocumento) {
  if (!doc.id) return;

  const url = this.casoService.getDocumentoVerURL(doc.id);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'documento';
  link.click();
}




  // Descargar documento
  // descargarDocumento(ruta: string) {
  //   window.open(`http://localhost:3000/${ruta}`, '_blank');
  // }

  // Eliminar documento
  // eliminarDocumento(documentoId: number) {
  //   if (!confirm('¿Seguro que deseas eliminar este documento?')) return;

  //   this.casoService.eliminarDocumento(documentoId).subscribe({
  //     next: () => this.cargarDocumentos(),
  //     error: (err) => console.error(err)
  //   });
  // }

  //eliminar un doc
//   eliminarDocumento(id: number) {
//   if (!confirm('¿Seguro que deseas eliminar este documento?')) return;

//   this.casoService.eliminarDocumento(id).subscribe({
//     next: () => {
//       this.cargarDocumentos(); //  clave
//     },
//     error: (err) => console.error('Error eliminando documento', err)
//   });
// }

// eliminarDocumento(doc: CasoDocumento) {
//   if (!doc.ruta) return; // si no hay archivo, no hace nada
//   if (!confirm('¿Seguro que deseas eliminar este archivo?')) return;

//   this.casoService.eliminarDocumento(doc.id).subscribe({
//     next: () => {
//       // Limpiamos la ruta y progreso del documento
//       doc.ruta = '';       //esto limpia la ruta
//       doc.progreso = 0;    // opcional, reinicia la barra de progreso
//       this.cdr.detectChanges(); // actualiza la vista inmediatamente
//     },
//     error: (err) => console.error('Error al eliminar archivo:', err)
//   });
// }

eliminarDocumento(doc: CasoDocumento) {
  if (!doc.ruta) return; // si no hay archivo, no hace nada
  if (!confirm('¿Seguro que deseas eliminar este archivo?')) return;

  this.casoService.eliminarDocumento(doc.id).subscribe({
    next: () => {
      // Limpiamos la ruta y progreso del documento
      doc.ruta = '';       // esto limpia la ruta
      doc.progreso = 0;    // opcional, reinicia la barra de progreso
      this.cdr.detectChanges(); // actualiza la vista inmediatamente
    },
    error: (err) => console.error('Error al eliminar archivo:', err)
  });
}





// validarDocumento(documentoId: number) {
//   const comentario = prompt('Comentario (opcional):') || '';
//   this.casoService.validarDocumento(documentoId, 'COMPLETADO', comentario).subscribe({
//     next: () => this.cargarDocumentos(),
//     error: (err) => console.error(err)
//   });
// }

isPendiente(doc: CasoDocumento): boolean {
  return doc.estado_validacion?.toLowerCase() !== 'completado';
}

validarDocumento(doc: CasoDocumento, estado: string) {
  const comentario = prompt('Comentario (opcional):') || '';

  this.casoService.validarDocumento(doc.id, estado, comentario)
    .subscribe({
      next: () => this.cargarDocumentos(),
      error: (err) => console.error('Error validando documento:', err)
    });
}


  getNombreTipo(id: number): string {
    const tipo = this.tiposDocumento.find(t => t.id === id);
    return tipo ? tipo.nombre : 'Documento';
  }



//   agregarDocumento() {
//   // Llamamos al servicio para crear un documento vacío
//   this.casoService.crearDocumento(this.idCaso)
//     .subscribe({
//       next: (res: CasoDocumento) => {
//         // Creamos el objeto CasoDocumento para la lista
//         const nuevo: CasoDocumento = {
//           ...res,                       // datos del backend
//           TipoDocumentoService: undefined, // no conocemos el tipo aún
//           ruta: res.ruta || '',         // inicializamos ruta
//           progreso: 0,                  // inicializamos progreso
//           tipo_archivo: res.tipo_archivo || '',
//           tamano_archivo: res.tamano_archivo || 0,
//           fecha_subida: res.fecha_subida || '',
//           fecha_caducidad: res.fecha_caducidad || null,
//           estado_validacion: res.estado_validacion || 'PENDIENTE',
//           es_obligatorio: res.es_obligatorio || false,
//           comentarios: res.comentarios || null
//         };

//         // ⚡ Agregamos el nuevo documento al arreglo de documentos
//         this.documentos.push(nuevo);

//         // Limpiamos el modal de creación
//         this.nuevoDoc = { tipo_documento_id: null, archivo: null };

//         console.log('Documento agregado correctamente:', nuevo);
//       },
//       error: (err) => {
//         console.error('Error al crear documento:', err);
//         alert('No se pudo crear el documento.');
//       }
//     });
// }

 abrirModalNuevoDocumento() {
    const modalEl = document.getElementById('modalNuevoDocumento');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  cerrarModalNuevoDocumento() {
    const modalEl = document.getElementById('modalNuevoDocumento');
    const modal = bootstrap.Modal.getInstance(modalEl!);
    modal?.hide();
  }

  agregarDocumento() {
    if (!this.nuevoDoc.nombre.trim()) {
      alert('Debe ingresar un nombre para el documento');
      return;
    }

    const payload: any = {
      id_caso: this.idCaso,
      nombre: this.nuevoDoc.nombre,
      descripcion: this.nuevoDoc.comentarios,
      es_obligatorio: this.nuevoDoc.es_obligatorio,
      tipo_documento_id: this.nuevoDoc.tipo_documento_id,
      nuevo_tipo_nombre: this.nuevoDoc.nuevo_tipo_nombre
    };

    this.casoService.crearDocumento(payload).subscribe({
      next: (res: any) => {
        const doc = {
          ...res.documento,
          progreso: 0,
          ruta: null,
         nombre: res.documento.nombre || this.getNombreTipo(res.documento.tipo_documento_id) || 'Nuevo Documento'

        };
        this.documentos.push(doc);
  this.nuevoDoc = { nombre: '', comentarios: '', es_obligatorio: true };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error creando documento', err)
    });
  }
onTipoDocumentoChange() {
  // si eliges un tipo existente, limpiamos el nombre nuevo
  if (this.nuevoDoc.tipo_documento_id) {
    this.nuevoDoc.nuevo_tipo_nombre = '';
  }
}


}












  // Agregar nuevo documento vacío
  // agregarDocumento() {
  //   this.casoService.crearDocumento(this.idCaso)
  //     .subscribe(() => this.cargarDocumentos());
  // }

// 
    
