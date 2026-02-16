import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class CasoService {
 private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
     this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/casos/';
  }


   // Crear un caso
  crearCaso(id_cliente: number, tipo_tramite_id: number): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, { id_cliente, tipo_tramite_id });
  }


// Obtener trámites desde la tabla tipo_tramite
  getTramites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myAppUrl}/api/tipoTramites`);
  }


    // Obtener documentos de un caso
  getDocumentosCaso(id_caso: number): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}${id_caso}/documentos`);
  }

    // Subir documento (multipart)
  subirDocumento(id_documento: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('files', file); // coincide con multer.array('files')
    return this.http.post(`${this.myAppUrl}/api/caso-documentos/${id_documento}/subir`, formData);
  }

    // Validar documento
  // validarDocumento(id_documento: number, estado: string, comentarios?: string): Observable<any> {
  //   return this.http.put(`${this.myAppUrl}/api/caso-documentos/${id_documento}/validar`, { estado, comentarios });
  // }
  validarDocumento(
    id_documento: number,
    estado: string,
    comentarios?: string
  ): Observable<any> {
    return this.http.put(
      `${this.myAppUrl}api/caso-documentos/${id_documento}/validar`,
      { estado, comentarios }
    );
  }

}
