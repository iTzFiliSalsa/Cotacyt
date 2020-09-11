import { Component, OnInit } from '@angular/core';
import { MunicipiosService } from '../services/municipios.service';
import { EscuelasService } from '../services/escuelas.service';
import { LocalidadesService } from '../services/localidades.service';
import { Escuelas } from '../models/escuelas.model';
import { Municipios } from '../models/municipios.model';
import { Localidades } from '../models/localidades.model';
import { Proyectos } from '../models/proyectos.model';
import { ProyectosService } from '../services/proyectos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoresService } from '../services/autores.service';
import swal from 'sweetalert2';
import { UtilsService } from '../services/utils.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-authors',
  templateUrl: './add-authors.component.html',
  styleUrls: ['./add-authors.component.scss']
})
export class AddAuthorsComponent implements OnInit {
  escuelas: Escuelas[];
  municipios: Municipios[];
  localidades: Localidades[];
  proyectos: Proyectos[];
  formRegistroAutores: FormGroup;
  constructor(
    private municipiosService: MunicipiosService,
    private escuelasService: EscuelasService,
    private localidadesService: LocalidadesService,
    private proyectosService: ProyectosService,
    private autoresService: AutoresService,
    private formBuilder: FormBuilder,
    private _utilService: UtilsService
  ) {
    this.formRegistroAutores = this.formBuilder.group({
      id_proyectos:   ['', [Validators.required]],
      id_escuelas:    ['1', [Validators.required]],
      id_municipios:  ['1', [Validators.required]],
      id_localidades: ['1', [Validators.required]],
      nombres:        ['', [Validators.required, Validators.maxLength(50)]],
      a_paterno:      ['', [Validators.required, Validators.maxLength(50)]],
      a_materno:      ['', [Validators.required, Validators.maxLength(50)]],
      telefono:       ['', [Validators.required, Validators.maxLength(10)]],
      email:          ['', [Validators.required, Validators.maxLength(50)]], 
    });
  }

  ngOnInit(): void {
    forkJoin({
      escuelas: this.escuelasService.getEscuelas(),
      localidades: this.localidadesService.getLocalidades(),
      municipios: this.municipiosService.getMunicipios(),
      proyectos: this.proyectosService.obtenerTodosLosProyectos(),
    }).subscribe(
      data => {
      this.escuelas = data.escuelas;
      this.localidades = data.localidades;
      this.municipios = data.municipios;
      this.proyectos = data.proyectos;
    }, err => {
      console.log(err);
    });
  }

  reigstrarAutor() {
    console.log(this.formRegistroAutores.value);
    this.autoresService.postAutor( this.formRegistroAutores.value )
    .subscribe(
      data => {
        swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El proyecto se registró correctamente'
        })
        this.formRegistroAutores.reset();
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

}
