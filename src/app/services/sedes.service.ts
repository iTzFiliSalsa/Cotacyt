import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Sedes } from '../models/sedes.model';

@Injectable({
  providedIn: 'root'
})
export class SedesService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }
  getSedes(): Observable<Sedes[]> {
    return this.http.get<Sedes[]>(this.servicesConfig.APP_ENDPOINT + 'api/sedes');
  }
  fechas(idSedes: string, inicio: string, fin: string): Observable<any> {
    const body = {
      id_sedes: idSedes,
      fecha_inicio: inicio,
      fecha_fin: fin
    }
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/sedes/fechas', body);
  }
  getFechas(idSedes: string): Observable<any> {
    return this.http.get(this.servicesConfig.APP_ENDPOINT + 'api/sedes/obtener-fechas?id_sedes=' + idSedes);
  }
}
