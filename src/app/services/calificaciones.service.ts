import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Session } from '../models/session.model';
import { Observable } from 'rxjs';
import { Calificaciones } from '../models/calificaciones.model';
import { CalificacionesPorCategoria }  from '../models/calificaciones.model'

@Injectable({
  providedIn: 'root'
})
export class CalificacionesService {
  sessionData: Session;
  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) {
  }

  proyectosEstadisticas(): Observable<Calificaciones[]> {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    return this.http.get<Calificaciones[]>(
      // this.servicesConfig.APP_ENDPOINT + 'api/calificaciones-por-categoria/' + this.sessionData.id_categorias);
      this.servicesConfig.APP_ENDPOINT + 'api/calificaciones-generales');
  }

  //obtener calificaciones por categorias
  listaDeCalificaciones(): Observable < CalificacionesPorCategoria[]>{
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    return this.http.get < CalificacionesPorCategoria[]>(
      this.servicesConfig.APP_ENDPOINT + 'api/calificaciones-generales-por-categoria?id_sedes=' + this.sessionData.id_sedes);
  }

  


}
