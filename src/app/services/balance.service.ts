import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from 'rxjs';
import { ResponseModel } from "../../classes/responseModel";
import { environment } from "../../environments/environment";
import { TotalBalances } from "../../classes/totalBalances";

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: HttpClient) { }

    getUserTotalBalances(groupId: number, userId: number): Observable<TotalBalances|null> {
        return this.http.get<ResponseModel<TotalBalances>>(`${environment.apiUrl}/balance?id_group=` + groupId + `&id_user=` + userId)
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
                    return throwError(() => new Error('Failed to fetch balances: ' + error.message));
                })
            );
    }

}