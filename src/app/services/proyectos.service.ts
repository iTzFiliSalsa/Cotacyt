import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Proyectos } from '../models/proyectos.model';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  sessionData: Session;
  constructor( private http: HttpClient, private servicesConfig: ServicesConfig) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
  }

  obtenerTodosLosProyectos(): Observable<Proyectos[]> {
    return this.http.get<Proyectos[]>( this.servicesConfig.APP_ENDPOINT + 'api/proyectos/all');
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
    return this.http.get<Proyectos[]>( this.servicesConfig.APP_ENDPOINT + 'api/proyectos/all/categoria/' + this.sessionData.id_categorias);
  }
}
