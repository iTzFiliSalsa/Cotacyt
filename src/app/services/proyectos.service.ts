import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Proyectos } from '../models/proyectos.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig) { }

  obtenerProyecto(idProyectos: string): Observable<Proyectos> {
    return this.http.get<Proyectos>(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/' + idProyectos);
  }
}
