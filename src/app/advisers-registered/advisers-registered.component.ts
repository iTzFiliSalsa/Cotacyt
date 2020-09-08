import { Component, OnInit } from '@angular/core';
import { AsesoresService } from '../services/asesores.service';
import { Asesores } from '../models/asesores.model';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-advisers-registered',
  templateUrl: './advisers-registered.component.html',
  styleUrls: ['./advisers-registered.component.scss']
})
export class AdvisersRegisteredComponent implements OnInit {

  public asesores: Array<Asesores>;

  constructor(
    private _asesoresService: AsesoresService,
    private _utilService: UtilsService
  ) {
    this._utilService.loading = true;
  }

  ngOnInit(): void {
    this._asesoresService.getAsesores().subscribe(
      res => {
        this.asesores = res;
        console.log(this.asesores);
      },
      err => {
        console.log(<any>err);
      }
    ).add(() => {
      this._utilService.loading = false;
    })
  }

}
