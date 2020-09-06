import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Session } from '../models/session.model';
import { Categorias } from '../models/categorias.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  sessionData: Session;
  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) {
  }

  getCategorias(): Observable<any> {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    return this.http.get( this.servicesConfig.APP_ENDPOINT + 'api/categorias/' + this.sessionData.id_categorias);
  }
  getAllCategrias(): Observable<Categorias[]> {
    return this.http.get<Categorias[]>(this.servicesConfig.APP_ENDPOINT + 'api/categorias');
  }
}
