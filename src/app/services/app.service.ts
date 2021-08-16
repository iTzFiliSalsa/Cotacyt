import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // TODO: api url
  // API_URL = 'http://localhost/APIS-CORAZAI-2.0/';
  API_URL = 'https://mante.hosting.acm.org/api-cecit-2021/';
  // API_URL = 'http://tecdevsmx.com/api-cecit-2021/';
  // API_URL = 'http://plataforma.cotacyt.gob.mx/api-cecit-2021/';
  constructor() { }
}
