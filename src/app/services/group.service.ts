import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../classes/user';
import { ResponseModel } from '../../classes/responseModel';
import { Group } from '../../classes/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

constructor(private http: HttpClient) { }

getGroups(): Observable<Array<Group>|null> {
  return this.http.get<ResponseModel<Array<Group>>>(`${environment.apiUrl}/groups`)
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
        return throwError(() => new Error('Failed to fetch groups: ' + error.message));
      })
    );
}

getGroup(groupname: string): Observable<Array<Group>|null> {
  return this.http.get<ResponseModel<Array<Group>>>(`${environment.apiUrl}/groups?groupname=` + groupname )
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
        return throwError(() => new Error('Failed to fetch group: ' + error.message));
      })
    );
}

getGroupById(groupId: number): Observable<Group|null> {
  return this.http.get<ResponseModel<Group>>(`${environment.apiUrl}/groups/` + String(groupId) )
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
        return throwError(() => new Error('Failed to fetch group: ' + error.message));
      })
    );
}

postGroup(group: Group): Observable<Group|null> {
  return this.http.post<ResponseModel<Group>>(`${environment.apiUrl}/groups`, group)
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
        return throwError(() => new Error('Failed to post group: ' + error.message));
      })
    );
}

putGroup(group: Group): Observable<Group|null> {
  console.log("group_id: " + group.id_group);
  console.log("name: " + group.name);
  return this.http.put<ResponseModel<Group>>(`${environment.apiUrl}/groups/` + group.id_group, group)
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
        return throwError(() => new Error('Failed to put group: ' + error.message));
      })
    );
}

deleteGroup(group_id: number): Observable<Group|null> {
  return this.http.delete<ResponseModel<Group>>(`${environment.apiUrl}/groups/` + group_id)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "NOT FOUND") {
          return null;
        } else if (response && response.message === "ERROR") {
          return null;
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to delete group: ' + error.message));
      })
    );
}


markGroupAsDeleted(id_group: number): Observable<Group|null> {
  return this.http.put<ResponseModel<Group>>(`${environment.apiUrl}/groups/makr_as_deleted?group_id=` + id_group, null)
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
        return throwError(() => new Error('Failed to put group: ' + error.message));
      })
    );
}

}
