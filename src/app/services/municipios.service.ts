import { Injectable } from '@angular/core';
import { ServicesConfig } from '../config/services.config';
import { HttpClient } from '@angular/common/http';
import { Municipios } from '../models/municipios.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }

  getMunicipios(): Observable<Municipios[]> {
    return this.http.get<Municipios[]>(this.servicesConfig.APP_ENDPOINT + 'api/municipios');
  }
}
