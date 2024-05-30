import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../classes/user';
import { ResponseModel } from '../../classes/responseModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private http: HttpClient) { }

getUsers(): Observable<Array<User>|null> {
  return this.http.get<ResponseModel<Array<User>>>(`${environment.apiUrl}/users`)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch users: ' + error.message));
      })
    );
}

updateUser(user: User, id: number): Observable<User|null> {
  console.log("Updating user: ", user, " with id: ", id);
  
  return this.http.put<ResponseModel<User>>(`${environment.apiUrl}/users/`+ id, user)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "ERROR") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to update user: ' + error.message));
      })
    );
}

getUserByUsername(username: string): Observable<User[]|null> {
  return this.http.get<ResponseModel<User[]>>(`${environment.apiUrl}/users?username=` + username)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch user: ' + error.message));
      })
    );
}

getUser(id: number): Observable<User|null> {
  return this.http.get<ResponseModel<User>>(`${environment.apiUrl}/user/` + id)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "ERROR") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to fetch user: ' + error.message));
      })
    );
}

postUser(user: User): Observable<User|null> {
  return this.http.post<ResponseModel<User>>(`${environment.apiUrl}/users`, user)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "ERROR") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to post user: ' + error.message));
      })
    );
}

getHelloMessage(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/hello`);
}

}
