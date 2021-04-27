import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILocal } from '../models/ILocal';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private headers = new HttpHeaders();

  /////////////////
  // Constructor //
  /////////////////

  constructor(
    private $http: HttpClient
  ) {
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  ///////////////////////
  // Private Accessors //
  ///////////////////////

  ///////////////////////
  // Public Accessors //
  ///////////////////////

  public getErrorResponse(errorResponse: HttpErrorResponse): any {
    if (errorResponse.error && errorResponse.error.length > 0 && errorResponse.error[0].message) {
      return errorResponse.error[0].message;
    } else {
      return 'Ocurrió un error inesperado';
    }
  }

  public getLocalById(id: any): Observable<ILocal> {
    return this.$http.get<ILocal>(`${environment.localesUrl}/local/${id}/edit`, { headers: this.headers });
  }

  public updateLocal(id: any, local: any): Observable<any[]> {
    return this.$http.put<any[]>(`${environment.localesUrl}/local/${id}/update`, local, { headers: this.headers });
  }

  public getAsociados(idAsociado: any): Observable<any[]> {
    return this.$http.get<any[]>(`${environment.localesUrl}/list?ids=${idAsociado}`, { headers: this.headers });
  }

  public pasarTurno(id: any): Observable<any[]> {
    return this.$http.put<any[]>(`${environment.localesUrl}/local/${id}/pasaTurno`, id, { headers: this.headers });
  }

  public cogerTurno(id: any): Observable<any[]> {
    return this.$http.put<any[]>(`${environment.localesUrl}/local/${id}/cogeTurno`, id, { headers: this.headers });
  }

  public retrocederTurno(id: any): Observable<any[]> {
    return this.$http.put<any[]>(`${environment.localesUrl}/local/${id}/retrocedeTurno`, id, { headers: this.headers });
  }
}
