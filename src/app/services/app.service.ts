import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // TODO: api url
  // API_URL = 'http://localhost:8081/applications/api-cecit-2021';
  API_URL = 'http://localhost:8081/php/API-COTACYT';
  // API_URL = 'https://mante.hosting.acm.org/api-cecit-2021/';
  // API_URL = 'http://tecdevsmx.com/api-cecit-2021/';
  // API_URL = 'http://plataforma.cotacyt.gob.mx/api-cecit-2021/';
  constructor() { }
}
