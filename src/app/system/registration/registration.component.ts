import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JuecesService } from '../../services/jueces.service';
import { RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import swal from 'sweetalert2';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {


  public isCollapsed = false;

  public formsRegistroJuez: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private juecesService: JuecesService,
    private _utilService: UtilsService
    ) {
    this.formsRegistroJuez = formBuilder.group({
      id_categorias: [1, [Validators.required]],
      usuario: ['', [Validators.required, Validators.maxLength(30)]],
      contrasena: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
  }
  registrarJuez() {
    this._utilService.loading = true;
    console.log(this.formsRegistroJuez.value);
    this.juecesService.registrarJuez(this.formsRegistroJuez.value).subscribe(
      data => {
        swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El juez se registro correctamente'
        })
        this.formsRegistroJuez.reset();
      },
      err => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el juez'
        })
      }
    ).add(() => {
      this._utilService.loading = false;
    });
  }






}
