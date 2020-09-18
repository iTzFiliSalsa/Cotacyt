import { Component, OnInit, ViewChild } from '@angular/core';
import { AsesoresService } from '../services/asesores.service';
import { Asesores } from '../models/asesores.model';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';
import { forkJoin } from 'rxjs';
import { Session } from '../models/session.model';

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
  sessionData: Session;
  sedes: Sedes[];
  constructor(
    private _asesoresService: AsesoresService,
    private _utilService: UtilsService,
    private sedesService: SedesService,
    private formBuilder: FormBuilder
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this._utilService.loading = true;
    this.formAsesores = this.formBuilder.group({
      nombres:     [''],
      a_paterno:   [''],
      a_materno:   [''],
      email:       [''],
      id_sedes:    this.sessionData.id_sedes,
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    forkJoin({
      asesores: this._asesoresService.getAsesores(),
      sedes: this.sedesService.getSedes()
    }).subscribe(
      data => {
        console.log(data.asesores);
        this.asesores = data.asesores;
        this.sedes = data.sedes;
      }
    ).add(() => {
      this._utilService._loading = false;
    });
  }
  setAsesor(asesor: Asesores) {
    this.asesorActual = asesor;
  }
  deleteAsesor() {
    this._utilService._loading = true;
    this._asesoresService.deleteAsesor(this.asesorActual.id_asesores)
      .subscribe( data => {
        Swal.fire({
          title: 'Se elimino el asesor correctamente',
          icon: 'success'
        });
      },
      err => {
        console.log(err);
        Swal.fire({
          title: 'Ocurrio un error al eliminar',
          icon: 'error'
        });
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
      id_sedes:    this.sessionData.id_sedes,
      descripcion: asesor.descripcion,
    });
    this.swalEdit.fire();
  }
  editarAsesor() {
    this._utilService._loading = true;
    this._asesoresService.updateAsesor( this.formAsesores.value, this.asesorActual.id_asesores )
      .subscribe(
        data => {
        Swal.fire({
          title: data,
          icon: 'success'
        });
        this.ngOnInit();
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
