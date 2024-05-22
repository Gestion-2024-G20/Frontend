import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../../classes/responseModel';
import { GroupMember } from '../../classes/groupMember';
import { group } from '@angular/animations';
import { Invitation } from '../../classes/invitation';
import { User } from '../../classes/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las invitaciones de un usuario
     * @param userId El id del usuario
     * @returns Un observable que devuelve un array de invitaciones o nulo si no se encontraron
     */
    getInvitationsByUserId(userId: number): Observable<Array<Invitation>|null> {
        return this.http.get<ResponseModel<Array<Invitation>>>(`${environment.apiUrl}/user/${userId}/userGroupInvitations`)
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

    /**
     * Crea una invitación
     * @param invitation La invitación a crear
     * @returns Un observable que devuelve la invitación creada o nulo si no se creó
     */
    createInvitation(invitation: Invitation): Observable<Invitation|null> {
        return this.http.post<ResponseModel<Invitation>>(`${environment.apiUrl}/invitations`, invitation)
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
                return throwError(() => new Error('Failed to create invitation: ' + error.message));
            })
        );
    }

    //Obtener invitacion por id
    getInvitationById(id: number): Observable<Invitation|null> {
        return this.http.get<ResponseModel<Invitation>>(`${environment.apiUrl}/invitations/` + id)
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
                return throwError(() => new Error('Failed to fetch invitation: ' + error.message));
            })
        );
    }

    //Borrar invitacion
    deleteInvitation(idInvitacion: number): Observable<Invitation|null> {
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

    //Obtener invitaciones por id de grupo
    getInvitationsByGroupId(groupId: number): Observable<Array<Invitation>|null> {
        return this.http.get<ResponseModel<Array<Invitation>>>(`${environment.apiUrl}/invitations/group/${groupId}`)
        .pipe(
            map(response => {
                // console.log(response)
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

    //Obtener invitación basado en un id_user y id_group
    getInvitationByUserIdGroupId(userId: number, groupId: number): Observable<Invitation|null> {
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

    //Obtener usuarios invitados a un grupo basados en un id de grupo
    getUsersInvitedToGroup(id_group: number): Observable<Array<User>|null> {
        console.log("El numero de grupo es", id_group);
        return this.http.get<ResponseModel<Array<User>>>(`${environment.apiUrl}/invitations/users/${id_group}`)
        .pipe(
            map(response => {
                console.log(response);
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

}