import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Totales, ProyectosCalificados, ProyectosPorCalificar } from '../models/dashboard.model';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor( private http: HttpClient, private appConfig: AppConfig ) {
  }

  getTotales(): Observable<Totales[]> {
    return this.http.get<Totales[]>(this.appConfig.APP_ENDPOINT + 'api/dashboard/totales');
  }

  getProyectosCalificados(): Observable<ProyectosCalificados[]> {
    return this.http.get<ProyectosCalificados[]>(this.appConfig.APP_ENDPOINT + 'api/dashboard/proyectos-calificados');
  }

  getProyectosPorCalificar(): Observable<ProyectosPorCalificar[]> {
    return this.http.get<ProyectosPorCalificar[]>(this.appConfig.APP_ENDPOINT + 'api/dashboard/proyectos-por-calificar');
  }
  getProyectosPorCategorias(): Observable<any> {
    return this.http.get<any>(this.appConfig.APP_ENDPOINT + 'api/dashboard/proyectos-por-categoria');
  }
}
