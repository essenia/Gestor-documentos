import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }


// 
  getRol() : string{
    return localStorage.getItem('rol') || '';

  }
  isLoggedIn() : boolean{
  //  !! Esto es un truco de JavaScript para convertir cualquier valor a booleano.
 return  !!localStorage.getItem('token'); // token JWT
  }

  logOut(): void{
    localStorage.clear()
  }
    // Guarda rol y token después del login
login(token: string, rol: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('rol', rol.toUpperCase()); // 🔹 convertimos a mayúsculas
}
}
