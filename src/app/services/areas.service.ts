import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(private _http: HttpClient) { 
  }
  get():Observable<any>{
    return this._http.get("https://cat-fact.herokuapp.com/facts");
  }

}
