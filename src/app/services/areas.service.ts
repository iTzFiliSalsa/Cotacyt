import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServicesConfig } from '../config/services.config';
import { Areas } from '../models/areas.model';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(private http: HttpClient, private servicesConfig: ServicesConfig) {
  }
  getAreas(): Observable<Areas[]> {
    return this.http.get<Areas[]>(this.servicesConfig.APP_ENDPOINT + 'api/areas');
  }

}
