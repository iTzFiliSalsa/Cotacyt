import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JuecesService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }

  registrarJuez( body: any ): Observable<any> {
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/jueces/nuevo', body);
  }
  iniciarSesionJuez( body: any ): Observable<any> {
    return this.http.post( this.servicesConfig.APP_ENDPOINT + 'api/login-jueces', body);
  }
  getJueces(): Observable<any> {
    return this.http.get( this.servicesConfig.APP_ENDPOINT + 'api/jueces' );
  }
  updateEvaluacion(body: any): Observable<any>{
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/jueces/termino', body);
  }
}
