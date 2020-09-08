import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JudgesRegistered } from '../models/judges.model';
import { ServicesConfig } from '../config/services.config';
import { Session } from '../models/session.model';

@Injectable({
    providedIn: 'root'
  })
  export class JudgesRegisteredService {
    sessionData: Session;
    constructor( private http: HttpClient, private servicesConfig: ServicesConfig ) {
      this.sessionData = JSON.parse(localStorage.getItem('session'));
    }
    
    getJudges(): Observable<JudgesRegistered[]>{
        return this.http.get<JudgesRegistered[]>(this.servicesConfig.APP_ENDPOINT + 'api/jueces/all')

    }
}