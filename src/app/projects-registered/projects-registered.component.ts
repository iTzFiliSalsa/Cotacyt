import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsRegisteredService } from '../services/project-registered.service'
import { ProjectRegistered } from '../models/project-regis.model';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Areas } from '../models/areas.model';
import { Sedes } from '../models/sedes.model';
import { Asesores } from '../models/asesores.model';
import { Categorias } from '../models/categorias.model';
import { SedesService } from '../services/sedes.service';
import { AreasService } from '../services/areas.service';
import { CategoriasService } from '../services/categorias.service';
import { AsesoresService } from '../services/asesores.service';
import { forkJoin } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Proyectos } from '../models/proyectos.model';
import { ProyectosService } from '../services/proyectos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-projects-registered',
  templateUrl: './projects-registered.component.html',
  styleUrls: ['./projects-registered.component.scss']
})
export class ProjectsRegisteredComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  proyectos: ProjectRegistered[];
  proyectoActual: ProjectRegistered;
  formProyecto: FormGroup;
  areas: Areas[];
  sedes: Sedes[];
  asesores: Asesores[];
  categorias: Categorias[];
  constructor(
    private projectsService: ProjectsRegisteredService,
    private _utilService: UtilsService,
    private formBuilder: FormBuilder,
    private sedesService: SedesService,
    private areasService: AreasService,
    private asesoresService: AsesoresService,
    private categoriasServices: CategoriasService,
    private obtenerProyecto: ProyectosService
  ) {
    this.proyectos = new Array<ProjectRegistered>();
    this.areas = new Array<Areas>();
    this.sedes = new Array<Sedes>();
    this.asesores = new Array<Asesores>();
    this.categorias = new Array<Categorias>();
    this._utilService.loading = true;
    this.formProyecto = this.formBuilder.group({
      id_proyectos: [''],
      id_asesores: [''],
      id_areas: [''],
      id_sedes: [''],
      id_categorias: [''],
      nombre: [''],
      resumen: [''],
    });
  }

  ngOnInit(): void {
    forkJoin(
      {
        areas: this.areasService.getAreas(),
        sedes: this.sedesService.getSedes(),
        categorias: this.categoriasServices.getAllCategrias(),
        asesores: this.asesoresService.getAsesores(),
        proyectos: this.projectsService.obtenerTodosLosProyectosDetalles()
      }
    ).subscribe(
      data => {
        this.areas = data.areas;
        this.sedes = data.sedes;
        this.categorias = data.categorias;
        this.asesores = data.asesores;
        this.proyectos = data.proyectos;
      },
      err => console.log(err)
    ).add(() => {
      this._utilService._loading = false;
    });
  }
  setProyectoActual(proyecto: ProjectRegistered) {
    this.proyectoActual = proyecto;
  }
  deleteProyectRegistred() {
    this._utilService.loading = true;
    this.projectsService.deleteProyectsRegistred(this.proyectoActual.id_proyectos)
      .subscribe(data => {
        // TODO: alert mejor
        alert(data);
        this.ngOnInit();
      },
        err => console.log(err)
      ).add(() => {
        this._utilService.loading = false;
      });
  }
  openSwal(proyecto: ProjectRegistered) {
    this.proyectoActual = proyecto;
    this.obtenerProyecto.obtenerProyecto(proyecto.id_proyectos).subscribe(
      data => {
        this.formProyecto.patchValue({
          id_proyectos:  data.id_proyectos,
          id_asesores:   data.id_asesores,
          id_areas:      data.id_areas,
          id_sedes:      data.id_sedes,
          id_categorias: data.id_categorias,
          nombre:        data.nombre,
          resumen:       data.resumen,
        });
      }, err => {
        console.log(err);
        Swal.fire({
          title: 'Ocurrio un error al obter los datos',
          icon: 'error'
        });
      }
    );
    this.swalEdit.fire();
  }
  editarProyecto() {
    console.log(this.formProyecto.value);
    this.projectsService.updateProyect( this.formProyecto.value, this.proyectoActual.id_proyectos)
    .subscribe( data => {
      Swal.fire({
        icon: 'success',
        title: data,
        text: '',
      });
      this.ngOnInit();
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'ocurrio un error al actualizar',
        text: '',
      });
    });
  }
}
