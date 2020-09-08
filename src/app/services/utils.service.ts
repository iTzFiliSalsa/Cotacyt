import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public loading: Boolean = false;
  public admin: Boolean = true;

  constructor() {}

  public set _loading(loading){
    this.loading = loading;
  }

  public get _loading(){
    return this.loading;
  }

  public set _cargo(cargo){
    this.admin = cargo
  }

  public get _cargo(){
    return this.admin;
  }
}
