import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }

  getEstadisticas(): Observable<any> {
    return this.http.get<any>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/proyectos-por-sede');
  }
}