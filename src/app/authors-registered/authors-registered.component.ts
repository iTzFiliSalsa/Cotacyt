import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoresService } from '../services/autores.service';
import { UtilsService } from '../services/utils.service';
import { Autores } from '../models/autores.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Escuelas } from '../models/escuelas.model';
import { Municipios } from '../models/municipios.model';
import { Localidades } from '../models/localidades.model';
import { Proyectos } from '../models/proyectos.model';
import { MunicipiosService } from '../services/municipios.service';
import { EscuelasService } from '../services/escuelas.service';
import { LocalidadesService } from '../services/localidades.service';
import { ProyectosService } from '../services/proyectos.service';
import { forkJoin } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { auto } from '@popperjs/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-authors-registered',
  templateUrl: './authors-registered.component.html',
  styleUrls: ['./authors-registered.component.scss']
})
export class AuthorsRegisteredComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  autores: Autores[];
  autorActual: Autores;
  formAutores: FormGroup;
  escuelas: Escuelas[];
  municipios: Municipios[];
  localidades: Localidades[];
  proyectos: Proyectos[];
  constructor(
    private municipiosService: MunicipiosService,
    private escuelasService: EscuelasService,
    private localidadesService: LocalidadesService,
    private proyectosService: ProyectosService,
    private autoresService: AutoresService,
    private utils: UtilsService,
    private formBuilder: FormBuilder
  ) {
    this.formAutores = this.formBuilder.group({
      nombres: [''],
      a_paterno: [''],
      a_materno: [''],
      telefono: [''],
      email: [''],
      id_proyectos: [''],
      id_escuelas: [''],
      id_municipios: [''],
      id_localidades: [''],
    });
  }

  ngOnInit(): void {
    this.utils._loading = true;
    forkJoin({
      escuelas: this.escuelasService.getEscuelas(),
      localidades: this.localidadesService.getLocalidades(),
      municipios: this.municipiosService.getMunicipios(),
      proyectos: this.proyectosService.obtenerTodosLosProyectos(),
      autores: this.autoresService.getAutores()
    }).subscribe(
      data => {
        this.escuelas = data.escuelas;
        this.localidades = data.localidades;
        this.municipios = data.municipios;
        this.proyectos = data.proyectos;
        this.autores = data.autores;
      }, err => {
        console.log(err);
      }).add(() => {
        this.utils._loading = false;
      });
  }

  setAutor(autor: Autores) {
    this.autorActual = autor;
  }
  deleteAutor() {
    this.utils._loading = true;
    this.autoresService.deleteAutores(this.autorActual.id_autores)
      .subscribe(data => {
        alert(data);
      },
        err => {
          console.log(err);
        }).add(() => {
          this.utils._loading = false;
          this.ngOnInit();
        });
  }
  openSwal(autor: Autores) {
    this.autorActual = autor;
    this.autoresService.getAutor(autor.id_autores)
      .subscribe(data => {
        this.formAutores.patchValue({
          nombres:        autor.nombre,
          a_paterno:      autor.a_paterno,
          a_materno:      autor.a_materno,
          telefono:       autor.telefono,
          email:          autor.email,
          id_proyectos:   data.id_proyectos,
          id_escuelas:    data.id_escuelas,
          id_municipios:  data.id_municipios,
          id_localidades: data.id_localidades,
        });
      }, err => {
        console.log(err);
        Swal.fire({
          title: 'Ocurrio un error al obtener los datos',
          icon: 'error'
        });
      });
    this.swalEdit.fire();
  }
  editarAutor() {
    this.utils._loading = true;
    this.autoresService.updateAutor( this.formAutores.value, this.autorActual.id_autores )
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
          title: 'Ocurrio un error al actualizar',
          icon: 'error'
        });
      }).add(() => {
        this.utils._loading = false;
      });
  }

}
