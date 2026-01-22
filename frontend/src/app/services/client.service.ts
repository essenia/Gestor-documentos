import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from '../interfaces/cliente';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
 private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/clientes/';
  }
  // Obtener todos los clientes
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  //  Obtener cliente por ID
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

   //  Crear cliente
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(
      `${this.myAppUrl}${this.myApiUrl}`,
      cliente
    );
  }

 //  Actualizar cliente
  actualizarCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.myAppUrl}${this.myApiUrl}${id}`,
      cliente
    );
  }

  getUltimosClientes(): Observable<Cliente[]> {
  return this.http.get<Cliente[]>('http://localhost:3000/api/clientes/ultimos');
}

// getUltimasAbogadas(): Observable<Abogada[]> {
//   return this.http.get<Abogada[]>('http://localhost:3000/api/abogadas/ultimas');
// }
}
