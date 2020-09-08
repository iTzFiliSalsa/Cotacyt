import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Localidades } from '../models/localidades.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }

  getLocalidades(): Observable<Localidades[]> {
    return this.http.get<Localidades[]>(this.servicesConfig.APP_ENDPOINT + 'api/localidades');
  }
}
