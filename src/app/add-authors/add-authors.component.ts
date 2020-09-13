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
import { Asesores } from '../models/asesores.model';
import { AsesoresService } from '../services/asesores.service';
import { jsPDF } from "jspdf";
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';

@Component({
  selector: 'app-add-authors',
  templateUrl: './add-authors.component.html',
  styleUrls: ['./add-authors.component.scss']
})
export class AddAuthorsComponent implements OnInit {
  escuelas: Escuelas[];
  asesores: Asesores[];
  municipios: Municipios[];
  localidades: Localidades[];
  proyectos: Proyectos[];
  sedes: Sedes[];
  formRegistroAutores: FormGroup;
  constructor(
    private municipiosService: MunicipiosService,
    private asesoresService: AsesoresService,
    private escuelasService: EscuelasService,
    private localidadesService: LocalidadesService,
    private proyectosService: ProyectosService,
    private autoresService: AutoresService,
    private formBuilder: FormBuilder,
    private sedesService: SedesService,
    private _utilService: UtilsService
  ) {
    this.formRegistroAutores = this.formBuilder.group({
      id_proyectos:   ['', [Validators.required]],
      id_escuelas:    ['1', [Validators.required]],
      id_municipios:  ['1', [Validators.required]],
      id_localidades: ['1', [Validators.required]],
      id_sedes:       ['1', [Validators.required]],
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
      sedes: this.sedesService.getSedes()
    }).subscribe(
      data => {
      this.escuelas = data.escuelas;
      this.localidades = data.localidades;
      this.municipios = data.municipios;
      this.proyectos = data.proyectos;
      this.sedes = data.sedes;
    }, err => {
      console.log(err);
    });
    this.asesoresService.getAsesores().subscribe(data => {
      this.asesores = data;
      console.log(this.asesores);
    
    } );
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

  saveAsPdf(){
    const doc = new jsPDF();
    doc.text(this.asesores[0]['a_materno'], 90, 100);
    doc.addImage('assets/image/logo.png', 'png', 10, 18, 60, 30)
    doc.save("constancia.pdf");
    
  }

}
