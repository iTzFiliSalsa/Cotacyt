import { Component, OnInit } from "@angular/core";
import { AsesoresService } from "../services/asesores.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UtilsService } from '../services/utils.service';
import swal from 'sweetalert2';
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';

@Component({
  selector: 'app-add-advisers',
  templateUrl: './add-advisers.component.html',
  styleUrls: ['./add-advisers.component.scss'],
})
export class AddAdvisersComponent implements OnInit {
  formRegistroAsesor: FormGroup;
  sedes: Sedes[];
  constructor(
    private asesoresService: AsesoresService,
    private formBuilder: FormBuilder,
    private sedesService: SedesService,
    private _utilService: UtilsService
  ) {
    this.formRegistroAsesor = this.formBuilder.group({
      nombres: ['', [Validators.required, Validators.maxLength(50)]],
      a_paterno: ['', [Validators.required, Validators.maxLength(50)]],
      a_materno: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.maxLength(50)]],
      id_sedes: ['1', [Validators.required, Validators.maxLength(2)]],
      descripcion: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  ngOnInit(): void {
    this.sedesService.getSedes().subscribe( data => this.sedes = data, err => console.log(err));
  }

  registrarAsesor() {
    this.asesoresService
      .postAsesor(this.formRegistroAsesor.value)
      .subscribe(
        (data) => {
          swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El asesor se registró correctamente',
          });
          this.formRegistroAsesor.reset();
        },
        (err) => {
          swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al registrar el asesor',
          });
        }
      )
      .add(() => {
        this._utilService.loading = false;
      });
  }
}
