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
}
