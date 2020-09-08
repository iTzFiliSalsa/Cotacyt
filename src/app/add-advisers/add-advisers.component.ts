import { Component, OnInit } from "@angular/core";
import { AsesoresService } from "../services/asesores.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UtilsService } from '../services/utils.service';
import swal from 'sweetalert2';

@Component({
  selector: "app-add-advisers",
  templateUrl: "./add-advisers.component.html",
  styleUrls: ["./add-advisers.component.scss"],
})
export class AddAdvisersComponent implements OnInit {
  formRegistroAsesor: FormGroup;
  constructor(
    private asesoresService: AsesoresService,
    private formBuilder: FormBuilder,
    private _utilService: UtilsService
  ) {
    this.formRegistroAsesor = this.formBuilder.group({
      nombres: ["", [Validators.required, Validators.maxLength(50)]],
      a_paterno: ["", [Validators.required, Validators.maxLength(50)]],
      a_materno: ["", [Validators.required, Validators.maxLength(50)]],
      email: ["", [Validators.required, Validators.maxLength(50)]],
      descripcion: ["", [Validators.required, Validators.maxLength(150)]],
    });
  }

  ngOnInit(): void {}

  registrarAsesor() {
    console.log(this.formRegistroAsesor.value);
    this.asesoresService
      .postAsesor(this.formRegistroAsesor.value)
      .subscribe(
        (data) => {
          swal.fire({
            icon: "success",
            title: "Exito",
            text: "El asesor se registró correctamente",
          });
          this.formRegistroAsesor.reset();
        },
        (err) => {
          swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al registrar el asesor",
          });
        }
      )
      .add(() => {
        this._utilService.loading = false;
      });
  }
}
