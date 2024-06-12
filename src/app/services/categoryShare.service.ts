import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ResponseModel } from '../../classes/responseModel';
import { environment } from '../../environments/environment';
import { CategoryShare } from '../../classes/categoryShare';


@Injectable({
  providedIn: 'root'
})
export class CategoryShareService {

    constructor(private http: HttpClient) { }

    getGroupCategoryShares(groupId: number): Observable<Array<CategoryShare>|null> {
        return this.http.get<ResponseModel<Array<CategoryShare>>>(`${environment.apiUrl}/categoryShares/id_group=${groupId}`)
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
                    return throwError(() => new Error('Failed to fetch Category Shares: ' + error.message));
                })
            );
        }

    getCategoryCategoryShares(categoryId: number): Observable<Array<CategoryShare>|null> {
            return this.http.get<ResponseModel<Array<CategoryShare>>>(`${environment.apiUrl}/categoryShares?id_category=${categoryId}`)
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
                        return throwError(() => new Error('Failed to fetch Category Shares: ' + error.message));
                    })
                );
            }
            
    addGroupCategoryShare(groupId: number, categoryShares: Array<CategoryShare>): any {
        return 1;
    }

    createCategoryShare(category: CategoryShare): Observable<CategoryShare|null> {
        return this.http.post<ResponseModel<CategoryShare>>(`${environment.apiUrl}/categoryShares`, category)
            .pipe(
                map(response => {
                    if (response && response.message === "OK" && response.dataModel) {
                        return response.dataModel;
                    } else if (response && response.message === "ERROR") {
                        throw new Error(response.detail)
                    } else {
                        throw new Error('Failed to deserialize response or invalid data received');
                    }
                }),
                catchError(error => {
                    return throwError(() => new Error('Failed to post category share: ' + error.message));
                })
            );
    }

    deleteCategoryShare(category_share_id: number): Observable<CategoryShare|null> {
        return this.http.delete<ResponseModel<CategoryShare>>(`${environment.apiUrl}/categoryShares/${category_share_id}`)
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
                    return throwError(() => new Error('Failed to delete category share: ' + error.message));
                })
            );
    }

    deleteCategoryCategoryShares(category_id: number): Observable<CategoryShare|null> {
        return this.http.delete<ResponseModel<CategoryShare>>(`${environment.apiUrl}/categoryCategoryShares/${category_id}`)
            .pipe(
                map(response => {
                    if (response && response.message === "OK" && response.dataModel) {
                        return response.dataModel;
                    } else if (response && response.code === 0 && response.message === "NOT FOUND") {
                        return null
                    } else if (response && response.message === "ERROR") {
                        throw new Error(response.detail); 
                    } else {
                        throw new Error('Failed to deserialize response or invalid data received');
                    }
                }),
                catchError(error => {
                    return throwError(() => new Error('Failed to delete category share: ' + error.message));
                })
            );
    }

    getCategoryShares(): Observable<Array<CategoryShare>|null> {
        return this.http.get<ResponseModel<Array<CategoryShare>>>(`${environment.apiUrl}/categoryShares`)
            .pipe(
                map(response => {
                    if (response && response.code === 0 && response.message === "OK" && response.dataModel) {
                        return response.dataModel;
                    } else if (response && response.code === 0 && response.message === "NOT FOUND") {
                        return null
                    } else if (response && response.code === 1 && response.message === "ERROR") {
                        throw new Error(response.detail);
                    } else {
                        throw new Error('Failed to deserialize response or invalid data received');
                    }
                }),
                catchError(error => {
                    return throwError(() => new Error('Failed to fetch category shares: ' + error.message));
                })
            );
    }


    putCategoryShare(categoryShare: CategoryShare): Observable<CategoryShare|null> {
        return this.http.put<ResponseModel<CategoryShare>>(`${environment.apiUrl}/categoryShares/` + categoryShare.id_cs, categoryShare)
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
              return throwError(() => new Error('Failed update categoryShares: ' + error.message));
            })
          );
      }
}