import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Escuelas } from '../models/escuelas.model';

@Injectable({
  providedIn: 'root'
})
export class EscuelasService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }

  getEscuelas(): Observable<Escuelas[]> {
    return this.http.get<Escuelas[]>(this.servicesConfig.APP_ENDPOINT + 'api/escuelas');
  }
}
