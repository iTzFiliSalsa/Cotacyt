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
    this.sessionData = JSON.parse(localStorage.getItem('session'));
  }

  proyectosEstadisticas(): Observable<Calificaciones[]> {
    return this.http.get<Calificaciones[]>(
      // this.servicesConfig.APP_ENDPOINT + 'api/calificaciones-por-categoria/' + this.sessionData.id_categorias);
      this.servicesConfig.APP_ENDPOINT + 'api/calificaciones-generales');
  }
  proyectosEstadisticasJuez(): Observable<Calificaciones[]> {
    if (this.sessionData.id_sedes === '8') {
      return this.http.get<Calificaciones[]>(this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones/categoria-estatales?id_categorias=' + this.sessionData.id_categorias);
    } else if (this.sessionData.id_sedes === '9') {
      return this.http.get<Calificaciones[]>(this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones/categoria-internacionales?id_categorias=' + this.sessionData.id_categorias);
    } else {
      return this.http.get<Calificaciones[]>(this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones/categoria?id_categorias=' + this.sessionData.id_categorias
        + '&id_sedes=' + this.sessionData.id_sedes);
    }
  }
  proyectosEstadisticasAdmin(): Observable<Calificaciones[]> {
    if (this.sessionData.id_sedes === '8') {
      return this.http.get<Calificaciones[]>(this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-sede-estatales');
    } else if (this.sessionData.id_sedes === '9') {
      return this.http.get<Calificaciones[]>(this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-sede-internacionales');
    } else {
      return this.http.get<Calificaciones[]>(this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-sede?id_sedes=' + this.sessionData.id_sedes);
    }
  }
  // obtener calificaciones por categorias
  listaDeCalificaciones(idCategoria: string): Observable < CalificacionesPorCategoria[]> {
    if (this.sessionData.id_sedes === '8') {
      return this.http.get < CalificacionesPorCategoria[]>(
        this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-categoria-estatales');
    } else if (this.sessionData.id_sedes === '9') {
      return this.http.get < CalificacionesPorCategoria[]>(
        this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-categoria-internacionales');
    } else {
      return this.http.get < CalificacionesPorCategoria[]>(
        this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-categoria?id_sedes='
        + this.sessionData.id_sedes
        + '&id_categorias=' + idCategoria);
    }
  }
  listaDeCalificacionesAdmin(idCategoria: string, idSedes: string): Observable < CalificacionesPorCategoria[]>{
    if (this.sessionData.id_sedes === '8') {
      return this.http.get < CalificacionesPorCategoria[]>(
        this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-categoria-estatales');
    } else if (this.sessionData.id_sedes === '9') {
      return this.http.get < CalificacionesPorCategoria[]>(
        this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-categoria-internacionales');
    } else {
      return this.http.get < CalificacionesPorCategoria[]>(
        this.servicesConfig.APP_ENDPOINT
        + 'api/calificaciones-generales-por-categoria?id_sedes='
        + idSedes
        + '&id_categorias=' + idCategoria);
    }
  }


}
