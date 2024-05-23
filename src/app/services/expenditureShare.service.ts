import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../../classes/user';
import { ResponseModel } from '../../classes/responseModel';
import { ExpenditureShare } from '../../classes/expenditureShare';

@Injectable({
  providedIn: 'root'
})
export class ExpenditureShareService {

  constructor(private http: HttpClient) { }

  getGroupExpenditureShares(group_id: number): Observable<Array<ExpenditureShare>|null> {
    return this.http.get<ResponseModel<Array<ExpenditureShare>>>(`${environment.apiUrl}/expenditure-shares/group/` + group_id)
      .pipe(
        map(response => {
          console.log(response)
          if (response && response.message === "OK" && response.dataModel) {
            return response.dataModel;
          } else if (response && response.message === "NOT FOUND") {
            return [];
          } else {
            throw new Error('Failed to deserialize response or invalid data received');
          }
        }),
        catchError(error => {
          return throwError(() => new Error('Failed to fetch expenditure shares: ' + error.message));
        })
      );
  }

  getExpenditureShare(expenditureShareName: string): Observable<Array<ExpenditureShare>|null> {
    return this.http.get<ResponseModel<Array<ExpenditureShare>>>(`${environment.apiUrl}/expenditure-shares?expenditureShareName=` + expenditureShareName)
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
          return throwError(() => new Error('Failed to fetch expenditure share: ' + error.message));
        })
      );
  }

  getExpenditureShareById(expenditureShareId: number): Observable<ExpenditureShare|null> {
    return this.http.get<ResponseModel<ExpenditureShare>>(`${environment.apiUrl}/expenditure-shares/` + String(expenditureShareId))
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
          return throwError(() => new Error('Failed to fetch expenditure share: ' + error.message));
        })
      );
  }

  postExpenditureShare(expenditureShare: ExpenditureShare): Observable<ExpenditureShare|null> {
    return this.http.post<ResponseModel<ExpenditureShare>>(`${environment.apiUrl}/expenditure-shares`, expenditureShare)
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
          return throwError(() => new Error('Failed to post expenditure share: ' + error.message));
        })
      );
  }

  putExpenditureShare(expenditureShare: ExpenditureShare): Observable<ExpenditureShare|null> {
    return this.http.put<ResponseModel<ExpenditureShare>>(`${environment.apiUrl}/expenditure-shares/` + expenditureShare.id_es, expenditureShare)
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
          return throwError(() => new Error('Failed to put expenditure share: ' + error.message));
        })
      );
  }

  deleteExpenditureSharesByExpenditureId(expenditureId: number): Observable<Array<ExpenditureShare>|null> {
    return this.http.delete<ResponseModel<Array<ExpenditureShare>>>(`${environment.apiUrl}/expenditureSharesByExpenditureId/` + expenditureId)
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
          return throwError(() => new Error('Failed to delete expenditure: ' + error.message));
        })
      );
  }

}
