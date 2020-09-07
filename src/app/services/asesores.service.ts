import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Asesores } from '../models/asesores.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoresService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }
  getAsesores(): Observable<Asesores[]> {
    return this.http.get<Asesores[]>(this.servicesConfig.APP_ENDPOINT + 'api/asesores/all');
  }
  postAsesor(body: any): Observable<any> {
    return this.http.post( this.servicesConfig.APP_ENDPOINT + 'api/asesores/nuevo', body );
  }
}
