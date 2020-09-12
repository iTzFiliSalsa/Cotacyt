import { Component, OnInit } from '@angular/core';
import { SedesService } from '../services/sedes.service';
import { AreasService } from '../services/areas.service';
import { AsesoresService } from '../services/asesores.service';
import { Areas } from '../models/areas.model';
import { Sedes } from '../models/sedes.model';
import { Asesores } from '../models/asesores.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriasService } from '../services/categorias.service';
import { Categorias } from '../models/categorias.model';
import { ProyectosService } from '../services/proyectos.service';
import { UtilsService } from '../services/utils.service';
import swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.scss']
})
export class AddProjectsComponent implements OnInit {
  areas: Areas[];
  sedes: Sedes[];
  asesores: Asesores[];
  categorias: Categorias[];
  autores = [];
  autoresSeleccionados: any[];
  dropdownSettings: IDropdownSettings;
  formRegistroProyecto: FormGroup;
  constructor(
    private sedesService: SedesService,
    private areasService: AreasService,
    private asesoresService: AsesoresService,
    private categoriasServices: CategoriasService,
    private proyectosService: ProyectosService,
    private formBuilder: FormBuilder,
    private _utilService: UtilsService
  ) {
    this.areas = new Array<Areas>();
    this.sedes = new Array<Sedes>();
    this.autoresSeleccionados = new Array<any>();
    this.asesores = new Array<Asesores>();
    this.categorias = new Array<Categorias>();
    this.formRegistroProyecto = this.formBuilder.group({
      nombre:   ['', [Validators.required, Validators.max(50)]],
      id_asesores:    ['1', [Validators.required]],
      id_sedes:       ['1', [Validators.required]],
      id_areas:       ['1', [Validators.required]],
      id_categorias:  ['1', [Validators.required]],
      resumen:        ['', [Validators.required, Validators.max(150)]]
    });
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id_autores',
      textField: 'asesor',
      itemsShowLimit: 3,
      limitSelection: 3,
      allowSearchFilter: true
    };
    this.autores =  [
      { id_autores: 1, asesor: 'kt' },
      { id_autores: 2, asesor: 'chino' },
      { id_autores: 3, asesor: 'fili' },
      { id_autores: 4, asesor: 'santi' },
      { id_autores: 5, asesor: 'Ne' }
    ];
    forkJoin(
      {
        areas: this.areasService.getAreas(),
        sedes: this.sedesService.getSedes(),
        categorias: this.categoriasServices.getAllCategrias(),
        asesores: this.asesoresService.getAsesores(),
      }
    ).subscribe( data => {
      this.areas = data.areas;
      this.sedes = data.sedes;
      this.categorias = data.categorias;
      this.asesores = data.asesores;
    });
  }
  registrarProyecto() {

    this._utilService.loading = true;
    this.proyectosService.postNuevoProyecto( this.formRegistroProyecto.value )
    .subscribe(
      data => {
        swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El proyecto se registró correctamente'
        })
        this.formRegistroProyecto.reset();
      },
      err => {
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el proyecto'
        })
      }
    ).add(() => {
      this._utilService.loading = false;
    });
  }
  addAutor(item) {
    console.log(item);
    this.autoresSeleccionados.push(item);
  }
  dropAutor(item) {
    console.log(item);
    this.autoresSeleccionados.map( (res, index) => {
      if (res.id_autores === item.id_autores) {
        this.autoresSeleccionados.splice(index, 1);
      }
    });
  }
}
