import { Attribute, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JuecesService } from '../../services/jueces.service';
import { RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import swal from 'sweetalert2';
import { SedesService } from '../../services/sedes.service';
import { Sedes } from '../../models/sedes.model';
import { Session } from '../../models/session.model';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {


  public isCollapsed = false;
  sedes: Sedes[];
  sessionData: Session;
  public formsRegistroJuez: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private juecesService: JuecesService,
    private sedesService: SedesService,
    private _utilService: UtilsService
    ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.formsRegistroJuez = formBuilder.group({
      id_categorias: [1, [Validators.required]],
      usuario:       ['', [Validators.required, Validators.maxLength(30)]],
      contrasena:    ['', [Validators.required, Validators.maxLength(20)]],
      nombre:        ['', [Validators.required, Validators.maxLength(100)]],
      id_sedes:      [this.sessionData.id_sedes],
    });
  }

  ngOnInit(): void {
    this.sedesService.getSedes().subscribe(data => this.sedes = data, err => console.log(err));
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
        this.formsRegistroJuez.reset({
          id_sedes: this.sessionData.id_sedes
        });
      },
      err => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el juez'
        });
        console.log(err);
      }
    ).add(() => {
      this._utilService.loading = false;
    });
  }






}
