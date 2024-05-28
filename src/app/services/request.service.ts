import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../../classes/responseModel';
import { Request } from '../../classes/request';

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

}
