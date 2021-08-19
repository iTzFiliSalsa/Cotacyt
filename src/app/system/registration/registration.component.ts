import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JuecesService } from '../../services/jueces.service';
import { UtilService } from 'src/app/services/util.service';
import swal from 'sweetalert2';
import { SedesService } from '../../services/sedes.service';
import { Sedes } from '../../models/sedes.model';
import { Session } from '../../models/session.model';
import { Proyectos } from '../../models/proyectos.model';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { JudgesRegisteredService } from '../../services/judges.service';
import { forkJoin } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';




@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  @ViewChild('swalid1') private swalid1: SwalComponent;

  public isCollapsed = false;
  sedes: Sedes[];
  sessionData: Session;
  proyectos: Proyectos[];
  proyectosSeleccionados: Proyectos[];
  dropdownSettingsProyecto: IDropdownSettings;
  public formsRegistroJuez: FormGroup;
  formFecha: FormGroup;
  superUser: boolean;
  categoriaActua = '1';
  sedeActual = '1';
  constructor(
    public formBuilder: FormBuilder,
    private juecesService: JuecesService,
    private sedesService: SedesService,
    private judgeRegistredService: JudgesRegisteredService,
    private proyectosService: ProyectosService,
    private utilService: UtilService
    ) {
    this.proyectos = new Array<Proyectos>();
    this.proyectosSeleccionados = new Array<Proyectos>();
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.formsRegistroJuez = formBuilder.group({
      id_categorias: [1, [Validators.required]],
      usuario:       ['', [Validators.required, Validators.maxLength(30)]],
      contrasena:    ['', [Validators.required, Validators.maxLength(20)]],
      nombre:        ['', [Validators.required, Validators.maxLength(100)]],
      id_sedes:      [this.sessionData.id_sedes],
      ids_proyectos: [''],
      rol: ['juez'],
    });
    this.utilService._loading = true;
    this.formFecha = formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.superUser = this.sessionData.rol === 'superuser';
    if ( this.sessionData.rol === 'superuser') {
      forkJoin({
        proyectos: this.proyectosService.obtenerProyectosSuperUserTemp(this.categoriaActua, this.sedeActual),
        sedes: this.sedesService.getSedes()
      }).subscribe(
        data => {
          this.proyectos = data.proyectos;
          this.sedes = data.sedes;
        }
        ).add(() => {
          this.utilService._loading = false;
          // Settings para proyecto
          this.dropdownSettingsProyecto = {
            singleSelection: false,
            idField: 'id_proyectos',
            textField: 'nombre',
            allowSearchFilter: true,
            noDataAvailablePlaceholderText: 'No hay proyectos'
          };
        });
    } else {
      forkJoin({
        proyectos: this.proyectosService.obtenerTodosLosProyectosCategoria('1'),
        sedes: this.sedesService.getSedes()
      }).subscribe(
        data => {
          this.proyectos = data.proyectos;
          this.sedes = data.sedes;
        }
        ).add(() => {
          this.utilService._loading = false;
          // Settings para proyecto
          this.dropdownSettingsProyecto = {
            singleSelection: false,
            idField: 'id_proyectos',
            textField: 'nombre',
            allowSearchFilter: true,
            noDataAvailablePlaceholderText: 'No hay proyectos'
          };
        });
    }
    }
    registrarJuez() {
      this.utilService.loading = true;
      this.juecesService.registrarJuez(this.formsRegistroJuez.value).subscribe(
        data => {
          swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El juez se registro correctamente'
          });
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
        this.utilService.loading = false;
      });
  }
  addProyecto(item: any) {
    this.proyectosSeleccionados.push(item);
  }
  dropProyecto(item: any) {
    this.proyectosSeleccionados.map( (res, index) => {
      if (res.id_proyectos === item.id_proyectos) {
        this.proyectosSeleccionados.splice(index, 1);
      }
    });
  }
  onChangesedeActual(value) {
    this.utilService._loading = true;
    this.sedeActual = value;
    this.proyectosService.obtenerProyectosSuperUserTemp(this.categoriaActua, value)
        .subscribe( data => {
          this.proyectos = data;
        }).add(() => this.utilService._loading = false);
  }
  onChangecategoriaActual(value) {
    this.utilService._loading = true;
    this.categoriaActua = value;
    if ( this.sessionData.rol === 'superuser') {
      this.proyectosService.obtenerProyectosSuperUserTemp(value, this.sedeActual)
        .subscribe( data => {
          this.proyectos = data;
        }).add(() => this.utilService._loading = false );
      } else {
        this.proyectosService.obtenerTodosLosProyectosCategoria(value)
          .subscribe( data => {
            this.proyectos = data;
          }).add(() => this.utilService._loading = false);
      }
  }
  mostrarSwal(evt: any) {
    this.swalid1.fire();
  }
  subirFechas() {
    this.sedesService.fechas( this.sessionData.id_sedes, this.formFecha.value.fechaInicio, this.formFecha.value.fechaFin).subscribe(
      data => {
        this.swalid1.dismiss();
      }
     );
  }
}
