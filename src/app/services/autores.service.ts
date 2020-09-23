import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Autores, AutorIds } from '../models/autores.model';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class AutoresService {
  sessionData: Session;
  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { 
    this.sessionData = JSON.parse(localStorage.getItem('session'));
  }

  postAutor( body: any ): Observable<any> {
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/autores/nuevo', body);
  }
  getAutores(): Observable<Autores[]> {
    return this.http.get<Autores[]>( this.servicesConfig.APP_ENDPOINT
      + 'api/autores/all?id_sedes=' + this.sessionData.id_sedes);
  }
  getAutoresSuperUser(): Observable<Autores[]> {
    return this.http.get<Autores[]>(this.servicesConfig.APP_ENDPOINT + '/api/autores/all-admin');
  }
  deleteAutores(idAutores: string): Observable<any> {
    return this.http.delete( this.servicesConfig.APP_ENDPOINT + 'api/asesores/eliminar/' + idAutores);
  }
  updateAutor(body: any, idAutor: string) {
    return this.http.put( this.servicesConfig.APP_ENDPOINT + 'api/autores/modificar/' + idAutor, body);
  }
  getAutor(idAutor: string): Observable<AutorIds> {
    return this.http.get<AutorIds>( this.servicesConfig.APP_ENDPOINT + 'api/autores/' + idAutor);
  }
  getAutoresSelect(): Observable<Autores[]> {
    return this.http.get<Autores[]>(this.servicesConfig.APP_ENDPOINT
      + 'api/autores/all-list?id_sedes=' + this.sessionData.id_sedes);
  }
  getAutoresSelectSuperUser(): Observable<Autores[]> {
    return this.http.get<Autores[]>(this.servicesConfig.APP_ENDPOINT
      + 'api/autores/all-admin');
  }
}
