import { Component, OnInit } from '@angular/core';
import { AsesoresService } from '../services/asesores.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilsService } from '../services/utils.service';
import swal from 'sweetalert2';
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';
import { Session } from '../models/session.model';

@Component({
  selector: 'app-add-advisers',
  templateUrl: './add-advisers.component.html',
  styleUrls: ['./add-advisers.component.scss'],
})
export class AddAdvisersComponent implements OnInit {
  formRegistroAsesor: FormGroup;
  sedes: Sedes[];
  sessionData: Session;
  constructor(
    private asesoresService: AsesoresService,
    private formBuilder: FormBuilder,
    private sedesService: SedesService,
    private _utilService: UtilsService
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.formRegistroAsesor = this.formBuilder.group({
      nombres:     ['', [Validators.required, Validators.maxLength(50)]],
      a_paterno:   ['', [Validators.required, Validators.maxLength(50)]],
      a_materno:   ['', [Validators.required, Validators.maxLength(50)]],
      email:       ['', [Validators.required, Validators.maxLength(50)]],
      id_sedes:    this.sessionData.id_sedes,
      descripcion: ['', [Validators.required, Validators.maxLength(150)]],
    });
    this._utilService._loading = true;
  }

  ngOnInit(): void {
    this.sedesService.getSedes()
      .subscribe( data => this.sedes = data, err => console.log(err))
      .add(() => this._utilService._loading = false);
  }

  registrarAsesor() {
    this._utilService._loading = true;
    this.asesoresService
      .postAsesor(this.formRegistroAsesor.value)
      .subscribe(
        (data) => {
          swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El asesor se registró correctamente',
          });
          this.formRegistroAsesor.reset({
            id_sedes: this.sessionData.id_sedes
          });
        },
        (err) => {
          swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al registrar el asesor',
          });
          console.error(err);
        }
      )
      .add(() => {
        this._utilService.loading = false;
      });
  }
}
