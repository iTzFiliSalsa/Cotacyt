import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  putData(data, id){
    return this._httpClient.post("https://mante.hosting.acm.org/API_COTACYT/video/guardarFoto.php", {
      'name': id,
      'data': data,
      'type': 'mp4'
    });
  }
}
