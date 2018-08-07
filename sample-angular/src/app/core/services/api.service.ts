import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  private formatErrors(error: any) {
    console.log(error);
    return error;
  }

  get(params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${environment.apiAuthUrl}`, { params })
      .pipe(catchError(this.formatErrors));
  }
}
