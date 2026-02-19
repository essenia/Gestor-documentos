import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cliente } from '../interfaces/cliente';
import { CasoDocumento } from '../interfaces/caso-documento';
import { Caso } from '../interfaces/caso';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class CasoService {
 public myAppUrl: string;
  public myApiUrl: string;
  constructor(private http: HttpClient,private authService: AuthServiceService) { 
     this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/casos/';
  }

    private getAuthHeaders() {
    const token = this.authService.isLoggedIn() ? localStorage.getItem('token') : '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

   // Crear un caso
  // crearCaso(id_cliente: number, tipo_tramite_id: number): Observable<any> {
  //   return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, { id_cliente, tipo_tramite_id });
  // }
  crearCaso(
    id_cliente: number,
    tipo_tramite_id: number,
    id_abogada: number = 1 // admin puede asignarse
  ): Observable<Caso> {
    const payload = {
      id_cliente,
      tipo_tramite_id,
      id_abogada,
      estado: 'nuevo',
      num_expediente: '', // si backend lo genera, puede dejarse vacío
      cod_caso: '',
      año: new Date().getFullYear(),
      fecha_creacion: new Date()
    };
    return this.http.post<Caso>(`${this.myAppUrl}${this.myApiUrl}`, payload);
  }
  //   return this.http.post(`${this.myAppUrl}api/caso-documentos/${id_documento}/subir`, formData);


  // Subir archivo usando PATCH y Multer
 subirDocumento(documentoId: number, file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('archivo', file); // ⚡ campo que espera Multer

    return this.http.patch(`${this.myAppUrl}api/caso-documentos/${documentoId}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

    // Obtener ruta de un documento por ID
  getDocumentoRuta(documentoId: number): Observable<string> {
    return this.http.get<{ ruta: string }>(`${this.myAppUrl}api/caso-documentos/ver/${documentoId}`)
      .pipe(
        map(response => response.ruta) // devuelve solo la ruta
      );
  }

  // Devuelve URL completa para abrir archivo
  // getDocumentoURL(ruta: string): string {
  //   return `${this.myAppUrl}uploads/${ruta}`;
  // }
  
//   getDocumentoURL(ruta: string): string {
//   if (!ruta) return '';
//   return `http://localhost:3000/${ruta}`;
// }




getDocumentoVerURL(id: number): string {
  return `http://localhost:3000/api/caso-documentos/ver/${id}`;
}

// Obtener trámites desde la tabla tipo_tramite
  getTramites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myAppUrl}api/tipoTramites`);
  }


    // Obtener documentos de un caso
  getDocumentosCaso(id_caso: number): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}${id_caso}/documentos`);
  }

    // Subir documento (multipart)
  // subirDocumento(id_documento: number, file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('files', file); // coincide con multer.array('files')
  //   return this.http.post(`${this.myAppUrl}api/caso-documentos/${id_documento}/subir`, formData);
  // }

  // Obtener todos los casos con cliente, trámite y documentos
  // getCasos(): Observable<any> {
  //   return this.http.get<any>(`${this.myAppUrl}${this.myApiUrl}`);
  // }
  getCasos(): Observable<{ ok: boolean; total: number; casos: Caso[] }> {
    return this.http.get<{ ok: boolean; total: number; casos: Caso[] }>(
      `${this.myAppUrl}${this.myApiUrl}`
    );
  }




//   eliminarDocumento(idDocumento: number) {
//   return this.http.delete(`${this.myAppUrl}caso-documentos/${idDocumento}`);
// }
    // Validar documento
  // validarDocumento(id_documento: number, estado: string, comentarios?: string): Observable<any> {
  //   return this.http.put(`${this.myAppUrl}/api/caso-documentos/${id_documento}/validar`, { estado, comentarios });
  // }

   // ✅ Obtener un caso por ID (incluye cliente y trámite)
  getCaso(idCaso: number): Observable<Caso> {
    return this.http.get<Caso>(`${this.myAppUrl}${this.myApiUrl}${idCaso}`);
  }
  validarDocumento(
    id_documento: number,
    estado: string,
    comentarios?: string
  ): Observable<any> {
    return this.http.patch(
      `${this.myAppUrl}api/caso-documentos/${id_documento}/validar`,
      { estado, comentarios }
    );
  }




// Crear Docs
crearDocumento(documento: { 
  id_caso: number; 
  nombre: string; 
  descripcion?: string; 
  es_obligatorio?: boolean; 
})
{
  return this.http.post(`${this.myAppUrl}api/caso-documentos`, documento);
}

//eliminar un Docs

eliminarDocumento(id: number) {
  return this.http.delete(
    `http://localhost:3000/api/caso-documentos/${id}`
  );
}

actualizarEstado(id: number, nuevoEstado: string) {
  return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}${id}/estado`, {
    nuevoEstado
  });
}

  getHistorial(casoId: number): Observable<any> {
    return this.http.get(`${this.myAppUrl}api/casos/historial/${casoId}`);
  }

}
