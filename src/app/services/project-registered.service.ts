import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectRegistered } from '../models/project-regis.model';
import { ServicesConfig } from '../config/services.config';
import { Session } from '../models/session.model';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
  })
  export class ProjectsRegisteredService {
    sessionData: Session;
    constructor(
      private http: HttpClient,
      private servicesConfig: ServicesConfig
      ) {
      this.sessionData = JSON.parse(localStorage.getItem('session'));
    }
    
    getProjects(): Observable<ProjectRegistered[]>{
        return this.http.get<ProjectRegistered[]>(
          this.servicesConfig.APP_ENDPOINT + 'api/proyectos/all?id_sedes=' + this.sessionData.id_sedes);
    }
    obtenerTodosLosProyectosDetalles(): Observable<ProjectRegistered[]> {
      return this.http.get<ProjectRegistered[]>( this.servicesConfig.APP_ENDPOINT + 'api/proyectos/all/details');
    }
    deleteProyectsRegistred(idProject: string): Observable<any> {
      return this.http.delete( this.servicesConfig.APP_ENDPOINT + 'api/proyectos/eliminar/' + idProject);
    }
    updateProyect(body: any) {
      return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/modificar', body);
    }
}