import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://localhost:8000'; // URL de tu backend FastAPI

  constructor(private http: HttpClient) { }

  // Ejemplo de función para obtener datos del backend
  getHelloMessage(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/hello`);
  }

  // Obtiene todos los users de la DB
  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.apiUrl}/users`);
  }

  // Obtiene todos los users de la DB
  getUser(username: string): Observable<[User]> {
    return this.http.get<[User]>(`${this.apiUrl}/user/` + username);
  }

  // Obtiene todos los users de la DB
  postUser(user: User): Observable<User>  {
    console.log("prepost"); 
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }
}
