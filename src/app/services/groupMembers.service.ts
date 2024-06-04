import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../../classes/responseModel';
import { GroupMember } from '../../classes/groupMember';
import { group } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class GroupMemberService {

constructor(private http: HttpClient) { }

getGroupMembers(groupId: number): Observable<Array<GroupMember>|null> {
  return this.http.get<ResponseModel<Array<GroupMember>>>(`${environment.apiUrl}/groupMembers?id_group=` + String(groupId))
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
        return throwError(() => new Error('Failed to fetch groupMembers: ' + error.message));
      })
    );
}

getUserIdGroupMembers(userId: number): Observable<Array<GroupMember>|null> {
  return this.http.get<ResponseModel<Array<GroupMember>>>(`${environment.apiUrl}/groupMembers?id_user=` + String(userId))
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
        return throwError(() => new Error('Failed to fetch user_id groupMembers: ' + error.message));
      })
    );
}

getUserIdGroupIdGroupMembers(userId: number, group_id: number): Observable<Array<GroupMember>|null> {
  return this.http.get<ResponseModel<Array<GroupMember>>>(`${environment.apiUrl}/groupMembers?id_user=` + String(userId) + `&id_group=` + group_id)
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
        return throwError(() => new Error('Failed to fetch user_id groupMembers: ' + error.message));
      })
    );
}

postGroupMember(groupMember: GroupMember): Observable<GroupMember|null> {
  return this.http.post<ResponseModel<GroupMember>>(`${environment.apiUrl}/groupMember`, groupMember)
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
        return throwError(() => new Error('Failed to post groupMember: ' + error.message));
      })
    );
}

deleteGroupMember(groupMember: GroupMember): Observable<GroupMember|null> {
  return this.http.delete<ResponseModel<GroupMember>>(`${environment.apiUrl}/groupMembers/` +  groupMember.id_gm)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          console.log(response)
          return response.dataModel;
        } else if (response && response.code == 1) {
          console.log(response)
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to delete groupMember: ' + error.message));
      })
    );
}

putGroupMember(groupMember: GroupMember): Observable<GroupMember|null> {
  return this.http.put<ResponseModel<GroupMember>>(`${environment.apiUrl}/groupMembers/` + groupMember.id_gm, groupMember)
    .pipe(
      map(response => {
        console.log(response)
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else if (response && response.message === "ERROR") {
          return null
        } else {
          throw new Error('Failed to deserialize response or invalid data received');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to put groupMember: ' + error.message));
      })
    );
}

}
