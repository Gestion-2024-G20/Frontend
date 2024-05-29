import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../../classes/responseModel';
import { Request } from '../../classes/request';
import { User } from '../../classes/user';
import { Invitation } from '../../classes/invitation';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

constructor(private http: HttpClient) { }

createRequest(request: Request): Observable<Request|null> {
  return this.http.post<ResponseModel<Request>>(`${environment.apiUrl}/requests`, request)
  .pipe(
      map(response => {
          if (response && response.message === "OK" && response.dataModel) {
              return response.dataModel;
          } else if (response && response.message === "ERROR") {
              return null;
          } else {
              throw new Error('Failed to deserialize response or invalid data received');
          }
      }),
      catchError(error => {
          return throwError(() => new Error('Failed to create request: ' + error.message));
      })
  );
}

getUsersRequestedToGroup(id_group: number): Observable<Array<User>|null> {
    console.log("El numero de grupo es", id_group);
    return this.http.get<ResponseModel<Array<User>>>(`${environment.apiUrl}/invitations/users/${id_group}?requested=true`)
    .pipe(
        map(response => {
            if (response && !(response.message == "ERROR") && response.dataModel) {
                return response.dataModel;
            }
            
            throw new Error('Failed to deserialize response or invalid data received');
            
        }),
        catchError(error => {
            return throwError(() => new Error('Failed to fetch users: ' + error.message));
        })
    );
}

getRequestByUserIdGroupId(userId: number, groupId: number): Observable<Invitation|null> {
    return this.http.get<ResponseModel<Invitation>>(`${environment.apiUrl}/invitations/${userId}/group/${groupId}`)
    .pipe(
        map(response => {
            if (response && response.message === "OK" && response.dataModel) {
                console.log(response);
                return response.dataModel;
            } else if (response && response.message === "ERROR") {
                console.log("Entré acá!!!")
                return null
            } else {
                throw new Error('Failed to deserialize response or invalid data received');
            }
        }),
        catchError(error => {
            return throwError(() => new Error('Failed to fetch invitation: ' + error.message));
        })
    );
}

getRequestsByUserId(userId: number): Observable<Array<Invitation>|null> {
    return this.http.get<ResponseModel<Array<Invitation>>>(`${environment.apiUrl}/user/${userId}/userGroupInvitations?requested=true`)
    .pipe(
        map(response => {
            if (response && response.message === "OK" && response.dataModel) {
                return response.dataModel;
            } else if (response && response.message === "NOT FOUND") {
                return null;
            } else {
                throw new Error('Failed to deserialize response or invalid data received');
            }
        }),
        catchError(error => {
            return throwError(() => new Error('Failed to fetch invitations: ' + error.message));
        })
    );
}

deleteRequest(idInvitacion: number): Observable<Invitation|null> {
    return this.http.delete<ResponseModel<Invitation>>(`${environment.apiUrl}/invitations/borrar/${idInvitacion}`)
    .pipe(
        map(response => {
            console.log("La respuesta fue", response);
            if (response && response.message === "OK" && response.dataModel) {
                return response.dataModel; //Retorna true
            } 

            throw new Error('Failed to deserialize response or invalid data received');

        }),
        catchError(error => {
            return throwError(() => new Error('Failed to fetch invitation: ' + error.message));
        })
    );
}

getRequestsByGroupId(groupId: number): Observable<Array<Invitation>|null> {
    return this.http.get<ResponseModel<Array<Invitation>>>(`${environment.apiUrl}/invitations/requested/group/${groupId}`)
    .pipe(
        map(response => {
            //Si la respuesta no devuelve error, puede ser que el listado de invitaciones sea [] o tenga valores.
            if (response && !(response.message === "ERROR")  && response.dataModel) {
                return response.dataModel;
            }
            
            throw new Error('Failed to deserialize response or invalid data received');
            
        }),
        catchError(error => {
            return throwError(() => new Error('Failed to fetch invitations: ' + error.message));
        })
    );
}

sendRequest(request: Request, userId: number): Observable<any|null> {    
    const data = {request, userId}
    return this.http.post<ResponseModel<Invitation>>(`${environment.apiUrl}/requests/join/${userId}`, request)
    .pipe(
        map(response => {
            if (response && response.message === "OK" && response.dataModel) {
                return response.dataModel;
            } else if (response && response.message === "ERROR") {
                throw new Error(response.detail);
            } else {
                throw new Error('Failed to deserialize response or invalid data received');
            }
        }),
        catchError(error => {
            return throwError(() => new Error('Failed to send request: ' + error.message));
        })
    );
  }
}
