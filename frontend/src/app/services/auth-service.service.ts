import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
    // 1 Estado de sesión (true / false)
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  // Observable que usará el navbar
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() { }
  // 3️⃣ Comprueba si hay token
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

// 
  getRol() : string{
    return localStorage.getItem('rol') || '';

  }
  isLoggedIn() : boolean{
  //  !! Esto es un truco de JavaScript para convertir cualquier valor a booleano.
 return  !!localStorage.getItem('token'); // token JWT
  }

  // logOut(): void{
  //   localStorage.clear()
  // }

    // Guarda rol y token después del login
login(token: string, rol: string) {
  localStorage.setItem('token', token);
  localStorage.setItem('rol', rol.toUpperCase()); 
    this.loggedInSubject.next(true);


}
    logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');

    // 🔥 avisamos a Angular
    this.loggedInSubject.next(false);
  }


  getUserId(): number {
  const id = localStorage.getItem('userId');
  return id ? +id : 0; // retorna 0 si no existe
}

getUserEmail(): string | null {
  return localStorage.getItem('email');
}


}
