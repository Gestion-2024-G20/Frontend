import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from 'rxjs';
import { Category } from "../../classes/category";
import { ResponseModel } from "../../classes/responseModel";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  createCategory(category: Category): Observable<Category|null> {
    return this.http.post<ResponseModel<Category>>(`${environment.apiUrl}/category`, category)
        .pipe(
            map(response => {
                if (response && response.message === "OK" && response.dataModel) {
                    return response.dataModel;
                } else if (response && response.message === "ERROR") {
                    if (response.code == 2){
                        throw new Error(response.detail);
                    }
                    return null
                } else {
                    throw new Error('Failed to deserialize response or invalid data received');
                }
            }),
            catchError(error => {
                return throwError(() => new Error(error.message));
            })
        );
    }

    deleteCategory(category_id: number): Observable<Category|null> {
        return this.http.delete<ResponseModel<Category>>(`${environment.apiUrl}/category/` + category_id)
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
                    return throwError(() => new Error(error.message));
                })
            );
    }

    getGroupCategories(groupId: number): Observable<Array<Category>|null> {
        return this.http.get<ResponseModel<Array<Category>>>(`${environment.apiUrl}/category?id_group=` + groupId )
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
                    return throwError(() => new Error('Failed to fetch categories: ' + error.message));
                })
            );
    }

    putCategory(category: Category): Observable<Category|null> {
        return this.http.put<ResponseModel<Category>>(`${environment.apiUrl}/category/` + category.id_category, category)
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
              return throwError(() => new Error('Failed update category: ' + error.message));
            })
          );
      }

}