import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';
import { Asesores } from '../models/asesores.model';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class AsesoresService {
  sessionData: Session;
  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { 
    this.sessionData = JSON.parse(localStorage.getItem('session'));
  }
  getAsesores(): Observable<Asesores[]> {
    return this.http.get<Asesores[]>(this.servicesConfig.APP_ENDPOINT + 'api/asesores/all?id_sedes=' + this.sessionData.id_sedes);
  }
  postAsesor(body: any): Observable<any> {
    return this.http.post( this.servicesConfig.APP_ENDPOINT + 'api/asesores/nuevo', body );
  }
  deleteAsesor(idAsesor: string) {
    return this.http.delete(this.servicesConfig.APP_ENDPOINT + 'api/asesores/eliminar/' + idAsesor);
  }
  updateAsesor( body: any, idAsesor: string ): Observable<any> {
    console.log(idAsesor);
    return this.http.put( this.servicesConfig.APP_ENDPOINT + 'api/asesores/modificar/' + idAsesor, body);
  }
}
