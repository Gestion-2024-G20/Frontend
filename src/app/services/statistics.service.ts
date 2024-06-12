import { Injectable } from '@angular/core';
import { Statistics } from '../../classes/statistics';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../../classes/responseModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

constructor(private http: HttpClient) { }

getStatistics(id_group: number): Observable<Statistics | null> {
  return this.http.get<ResponseModel<Statistics>>(`${environment.apiUrl}/statistics/${String(id_group)}`)
    .pipe(
      map(response => {
        if (response && response.message === "OK" && response.dataModel) {
          return response.dataModel;
        } else {
          throw new Error('Failed to calculate statistics');
        }
      }),
      catchError(error => {
        return throwError(() => new Error('Failed to calculate statistics: ' + error.message));
      })
    );
}

}
