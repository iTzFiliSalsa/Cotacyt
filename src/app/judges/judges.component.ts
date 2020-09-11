import { Component, OnInit, ViewChild } from '@angular/core';
import { JudgesRegisteredService } from '../services/judges.service';
import { JudgesRegistered } from '../models/judges.model';
import { UtilsService } from '../services/utils.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-judges',
  templateUrl: './judges.component.html',
  styleUrls: ['./judges.component.scss']
})
export class JudgesComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  jueces: JudgesRegistered[];
  juezActual: JudgesRegistered;
  formJuez: FormGroup;
  constructor(
    private judgesService: JudgesRegisteredService,
    private _utilService: UtilsService,
    private formBuilder: FormBuilder
  ) {
    this.jueces = new Array<JudgesRegistered>();
    this._utilService.loading = true;
    this.formJuez = this.formBuilder.group({
      id_categorias: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.judgesService.getJudges().subscribe(
      data => {
        this.jueces = data;
      },
      err => {
        console.log(err);
      }).add(() => {
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
        alert(data);
      },
        err => {
          console.log(err);
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
      id_categorias: this.verificarCat(this.juezActual.categoria)
    });
    this.swalEdit.fire();
  }
  editarJuez() {
    this._utilService._loading = true;
    this.judgesService.updateJudge(this.formJuez.value, this.juezActual.id_jueces)
      .subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: data,
          text: '',
        });
        this.ngOnInit();
      },
        err => {
          console.log(err);
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
