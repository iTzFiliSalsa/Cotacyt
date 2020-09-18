import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  putData(data){
    return this._httpClient.post("https://mante.hosting.acm.org/API_COTACYT/video/guardarFoto.php", {
      'name': 'ejemplo2',
      'data': data,
      'type': 'mp4'
    });
  }
}
