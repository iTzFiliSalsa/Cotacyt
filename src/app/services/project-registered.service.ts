import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectsRegistered } from '../models/project-regis.model';
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
    
    getProjects(): Observable<ProjectsRegistered[]>{
        return this.http.get<ProjectsRegistered[]>(this.servicesConfig.APP_ENDPOINT + 'api/proyectos/all')

    }
}