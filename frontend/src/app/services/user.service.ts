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

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users/'
  }
  signIn(user: User):Observable<any>{
   return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, user)
    .pipe(
      tap(res => {
        //  Guardamos token que devuelve el backend
        if (res && res.token) {
          localStorage.setItem('token', res.token);
        }
      })
    );

  }
}
