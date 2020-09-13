import { Component, OnInit, ViewChild } from '@angular/core';
import { AsesoresService } from '../services/asesores.service';
import { Asesores } from '../models/asesores.model';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advisers-registered',
  templateUrl: './advisers-registered.component.html',
  styleUrls: ['./advisers-registered.component.scss']
})
export class AdvisersRegisteredComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  public asesores: Array<Asesores>;
  asesorActual: Asesores;
  formAsesores: FormGroup;
  constructor(
    private _asesoresService: AsesoresService,
    private _utilService: UtilsService,
    private formBuilder: FormBuilder
  ) {
    this._utilService.loading = true;
    this.formAsesores = this.formBuilder.group({
      nombres: [''],
      a_paterno: [''],
      a_materno: [''],
      email: [''],
      descripcion: [''],
    });
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
    });
  }
  setAsesor(asesor: Asesores) {
    this.asesorActual = asesor;
    console.log(asesor);
  }
  deleteAsesor() {
    this._utilService._loading = true;
    this._asesoresService.deleteAsesor(this.asesorActual.id_asesores)
      .subscribe( data => {
        alert(data);
      },
      err => {
        console.log(err);
      }).add(() => {
        this._utilService._loading = false;
        this.ngOnInit();
      });
  }
  openSwal(asesor: Asesores) {
    this.asesorActual = asesor;
    this.formAsesores.patchValue({
      nombres:     asesor.nombres,
      a_paterno:   asesor.a_paterno,
      a_materno:   asesor.a_materno,
      email:       asesor.email,
      descripcion: asesor.descripcion,
    });
    this.swalEdit.fire();
  }
  editarAsesor() {
    this._utilService._loading = true;
    console.log(this.formAsesores.value);
    this._asesoresService.updateAsesor( this.formAsesores.value, this.asesorActual.id_asesores )
      .subscribe(
        data => {
        Swal.fire({
          title: data,
          icon: 'success'
        });
      }, err => {
        console.log(err);
        Swal.fire({
          title: 'Ocurrio un error al editar',
          icon: 'error'
        });
      }).add(() => {
        this._utilService._loading = false;
      });
  }

}
