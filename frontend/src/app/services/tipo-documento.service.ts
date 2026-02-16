import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoDocumento } from '../interfaces/TipoDocumento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
 private myAppUrl: string;
  // private myApiUrl: string;
  constructor(private http: HttpClient) { 
 this.myAppUrl = environment.endpoint;
  
  }
// lista de tipo docs
  getTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.myAppUrl}api/tipo-documentos`);
  }
}
