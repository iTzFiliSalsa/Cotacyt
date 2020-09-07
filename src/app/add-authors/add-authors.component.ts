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
    private formBuilder: FormBuilder
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
    this.escuelasService.getEscuelas()
    .subscribe( data => this.escuelas = data, err => console.log( err ));
    this.localidadesService.getLocalidades()
    .subscribe( data => this.localidades = data, err => console.log( err ));
    this.municipiosService.getMunicipios()
    .subscribe( data => this.municipios = data, err => console.log( err ));
    this.proyectosService.obtenerTodosLosProyectos()
    .subscribe( data => this.proyectos = data, err => console.log( err ));
  }

  reigstrarAutor() {
    this.autoresService.postAutor( this.formRegistroAutores.value )
    .subscribe( data => {
      alert(data);
      this.formRegistroAutores.reset();
    },
    err => console.log( err ));
  }

}
