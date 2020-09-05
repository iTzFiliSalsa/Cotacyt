import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public loading: Boolean = false;

  constructor() {}

  public set _loading(loading){
    this.loading = loading;
  }

  public get _loading(){
    return this.loading;
  }
}
