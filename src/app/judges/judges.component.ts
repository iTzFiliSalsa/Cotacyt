import { Component, OnInit, ViewChild } from '@angular/core';
import { JudgesRegisteredService } from '../services/judges.service';
import { JudgesRegistered } from '../models/judges.model';
import { UtilsService } from '../services/utils.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-judges',
  templateUrl: './judges.component.html',
  styleUrls: ['./judges.component.scss']
})
export class JudgesComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  jueces: JudgesRegistered[];
  juezActual: JudgesRegistered;
  sedes: Sedes[];
  formJuez: FormGroup;
  constructor(
    private judgesService: JudgesRegisteredService,
    private _utilService: UtilsService,
    private sedesService: SedesService,
    private formBuilder: FormBuilder
  ) {
    this.jueces = new Array<JudgesRegistered>();
    this._utilService.loading = true;
    this.formJuez = this.formBuilder.group({
      id_categorias: ['', [Validators.required]],
      id_sedes: ['1', [Validators.required]],
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    forkJoin({
      jueces: this.judgesService.getJudges(),
      sedes: this.sedesService.getSedes(),
    }).subscribe(
      data => {
        console.log(data.jueces);
        this.jueces = data.jueces;
        this.sedes = data.sedes;
      },
      err => {
        console.log(err);
      }
    ).add(() => {
      this._utilService.loading = false;
    });
  }
  setJudge(juez: JudgesRegistered) {
    this.juezActual = juez;
  }
  deleteJudge() {
    this._utilService._loading = true;
    this.judgesService.deleteJudges(this.juezActual.id_jueces)
      .subscribe(data => {
        Swal.fire({
          title: 'Se elimino correctamente',
          icon: 'success',
        });
      },
        err => {
          console.log(err);
          Swal.fire({
            title: 'Ocurrio un error al eliminar',
            icon: 'error',
          });
        }).add(() => {
          this._utilService._loading = false;
          this.ngOnInit();
        });
  }
  open(juez: JudgesRegistered) {
    this.juezActual = juez;
    this.formJuez.patchValue({
      usuario: this.juezActual.usuario,
      contrasena: this.juezActual.contrasena,
      nombre: this.juezActual.nombre,
      id_sedes: this.juezActual.id_sedes,
      id_categorias: this.verificarCat(this.juezActual.categoria)
    });
    this.swalEdit.fire();
  }
  editarJuez() {
    this._utilService._loading = true;
    console.log(this.formJuez.value);
    this.judgesService.updateJudge(this.formJuez.value, this.juezActual.id_jueces)
      .subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: data,
        });
        this.ngOnInit();
      },
        err => {
          console.log(err);
          Swal.fire({
            title: 'Ocurrio un error',
            icon: 'error'
          })
        }).add(() => {
          this._utilService._loading = false;
        });
  }
  verificarCat(categoria: string) {
    switch (categoria) {
      case 'petit':
        return 1;
      case 'kids':
        return 2;
      case 'juvenil':
        return 3;
      case 'media superior':
        return 4;
      case 'superior':
        return 5;
      case 'posgrado':
        return 6;
    }
  }
}
