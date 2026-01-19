import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/user';




@Injectable({
  providedIn: 'root'
})
export class UserService {

   private myAppUrl : string;
  private myApiUrl : string;
    // private baseUrl = 'http://localhost:3000/api/auth'; 
    private baseUrl : string;
    // Ajusta según tu backend


  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users/'
    this.baseUrl = 'api/auth'
  }
  // signIn(user: User):Observable<any>{
  //  return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, user)
  //   .pipe(
  //     tap(res => {
  //       //  Guardamos token que devuelve el backend
  //       if (res && res.token) {
  //         localStorage.setItem('token', res.token);
  //       }
  //     })
  //   );

  // }

  signIn(user: User):Observable<any>{
   return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, user);
    
  }

  login(user : User):Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}api/auth/login`, user);
  }

 // Cambio de contraseña
 changePassword(userId: number, newPassword: string){
  return this.http.post('http://localhost:3000/api/auth/change-password',
 {
    userId,
    newPassword
  });
}

}
