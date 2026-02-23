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
import { ChangeDetectorRef, NgZone } from '@angular/core';
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



mostrarCamposExtra: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private casoService: CasoService,
    private tipoDocumentoService: TipoDocumentoService,
        private clienteService: ClientService,
    private tramiteService: TipoDocumentoService,
  private cdr: ChangeDetectorRef,  private ngZone: NgZone


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




verDocumento(doc: CasoDocumento) {
  if (!doc.id) return;
  window.open(this.casoService.getDocumentoVerURL(doc.id), '_blank');
}


descargarDocumento(doc: CasoDocumento) {
  if (!doc.id) return;

  const url = this.casoService.getDocumentoVerURL(doc.id);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'documento';
  link.click();
}





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



 abrirModalNuevoDocumento() {
    const modalEl = document.getElementById('modalNuevoDocumento');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  }

  cerrarModalNuevoDocumento() {
    const modalEl = document.getElementById('modalNuevoDocumento');
    const modal = bootstrap.Modal.getInstance(modalEl!);
    modal?.hide();

  // Limpiar formulario al cerrar
  this.nuevoDoc = { nombre: '', comentarios: '', es_obligatorio: true };
  this.mostrarCamposExtra = false;
  }

  agregarDocumento() {
   
//    if (!this.nuevoDoc.nombre || !this.nuevoDoc.nombre.trim()) {
//   alert('El documento seleccionado no tiene nombre. Verifique la lista.');
//   return;
// }
  const nombreDoc = this.nuevoDoc.nuevo_tipo_nombre?.trim() || this.nuevoDoc.nombre?.trim();

  if (!nombreDoc) {
    alert('El documento seleccionado no tiene nombre. Verifique la lista.');
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
                // nombre: res.documento.nombre || this.getNombreTipo(res.documento.tipo_documento_id),

          progreso: 0,
          ruta: null,
        //  nombre: res.documento.nombre || this.getNombreTipo(res.documento.tipo_documento_id) || 'Nuevo Documento'
        nombre: nombreDoc,

        };

        this.documentos.push(doc);

  this.nuevoDoc = { nombre: '', comentarios: '', es_obligatorio: true };

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error creando documento', err)
    });
  }

onTipoDocumentoChange() {
  const seleccionado = this.tiposDocumento.find(
    tipo => tipo.id === this.nuevoDoc.tipo_documento_id
  );

  if (seleccionado) {
    // asignamos el nombre automáticamente
    this.nuevoDoc.nombre = seleccionado.nombre;
    // si tienes un campo para nombre nuevo opcional
    this.nuevoDoc.nuevo_tipo_nombre = '';

  } else {
    this.nuevoDoc.nombre = ''; // si no hay selección, limpiamos
  }

}

}












  