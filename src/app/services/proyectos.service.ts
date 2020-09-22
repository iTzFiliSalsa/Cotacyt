import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Proyectos, ProyectSelect } from '../models/proyectos.model';
import { Session } from '../models/session.model';
import { InformacionDeLosProyectos } from '../models/proyectos.model'

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  sessionData: Session;
  constructor( private http: HttpClient, private servicesConfig: ServicesConfig) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
  }

  obtenerTodosLosProyectos(): Observable<Proyectos[]> {
    return this.http.get<Proyectos[]>( this.servicesConfig.APP_ENDPOINT
      + 'api/proyectos/all?id_sedes='
      + this.sessionData.id_sedes);
  }
  obtenerTodosLosProyectosCategoria(idCategorias: string): Observable<Proyectos[]> {
    return this.http.get<Proyectos[]>( this.servicesConfig.APP_ENDPOINT
      + 'api/proyectos/all-categoria?id_sedes='
      + this.sessionData.id_sedes
      + '&id_categorias=' + idCategorias);
  }
  obtenerProyecto(idProyectos: string): Observable<Proyectos> {
    return this.http.get<Proyectos>(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/' + idProyectos);
  }
  actualizarEstado( idProyectos: string ): Observable<any> {
    console.log(idProyectos);
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/modificar-status', {id_proyectos: idProyectos});
  }
  setProyectoCalificado(idProyectos: string, idCategorias): Observable<any> {
    const body = {
      id_proyectos: idProyectos,
      id_categorias: idCategorias,
      id_jueces: this.sessionData.id_jueces
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/proyectos-calificados/nuevo', body);
  }
  postNuevoProyecto(body: any) {
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/nuevo', body);
  }
  obtenerTodosLosProyectosDeCategoria(): Observable<Proyectos[]> {
    return this.http.get<Proyectos[]>(
      this.servicesConfig.APP_ENDPOINT
      + 'api/proyectos/all/categoria?id_categorias='
      + this.sessionData.id_categorias
      + '&id_sedes=' + this.sessionData.id_sedes
      + '&id_jueces=' + this.sessionData.id_jueces
    );
  }

  obtenerInformacionDeUnProyecto(id_proyectos:string): Observable<InformacionDeLosProyectos[]>{
    return this.http.get<InformacionDeLosProyectos[]>(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/all/details/' + id_proyectos)
  }
  getStatusAdmin(idProyectos: string): Observable<any> {
    const body = {
      id_proyectos: idProyectos
    };
    return this.http.post<any>(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/admin/obtener-status', body);
  }
  getStatusProyecto(idProyecto: string): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      id_categoria: this.sessionData.id_categorias
    };
    return this.http.post<any>(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/obtener-status', body);
  }

  getProyectosPorCategoria(): Observable<any>{
    return this.http.get<any>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/proyectos-por-categoria'); 
  }

  getAsesoresPorSede(): Observable<any>{
    return this.http.get<any>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/asesores-por-sede');
  }

  getParticipantesPorSede(): Observable<any>{
    return this.http.get<any>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/participantes-por-sede');
  }

  getParticipantesPorCategoria(): Observable<any>{
    return this.http.get<any>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/participantes-por-categoria');
  }
  getAutoresProyecto(idProyecto: string): Observable<any> {
    return this.http.get(this.servicesConfig.APP_ENDPOINT
      + 'api/autores/per-project?id_sedes=' + this.sessionData.id_sedes
      + '&id_proyectos=' + idProyecto);
  }
  obtenerProyectosSelect(idJueces: string): Observable<ProyectSelect[]> {
    return this.http.get<ProyectSelect[]>(this.servicesConfig.APP_ENDPOINT
      + 'api/proyectos/all/per-judge?id_jueces=' + idJueces );
  }
}

