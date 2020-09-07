import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoresService {

  constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) { }

  postAutor( body: any ): Observable<any> {
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/autores/nuevo', body);
  }
}
