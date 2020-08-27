import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Totales, ProyectosCalificados, ProyectosPorCalificar } from '../models/dashboard.model';
import { ServicesConfig } from '../config/services.config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) {}

  getTotales(): Observable<Totales[]> {
    return this.http.get<Totales[]>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/totales');
  }

  getProyectosCalificados(): Observable<ProyectosCalificados[]> {
    return this.http.get<ProyectosCalificados[]>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/proyectos-calificados');
  }

  getProyectosPorCalificar(): Observable<ProyectosPorCalificar[]> {
    return this.http.get<ProyectosPorCalificar[]>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/proyectos-por-calificar');
  }
  getProyectosPorCategorias(): Observable<any> {
    return this.http.get<any>(this.servicesConfig.APP_ENDPOINT + 'api/dashboard/proyectos-por-categoria');
  }
}
