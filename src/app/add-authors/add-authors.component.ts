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
import { Session } from '../models/session.model';

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
  sessionData: Session;
  superUser: boolean;
  formRegistroAutores: FormGroup;
  sedeActual: string;
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
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.formRegistroAutores = this.formBuilder.group({
      id_proyectos:   ['', [Validators.required]],
      id_escuelas:    ['1', [Validators.required]],
      id_municipios:  ['1', [Validators.required]],
      id_localidades: ['1', [Validators.required]],
      id_sedes:       this.sessionData.id_sedes,
      nombres:        ['', [Validators.required, Validators.maxLength(50)]],
      a_paterno:      ['', [Validators.required, Validators.maxLength(50)]],
      a_materno:      ['', [Validators.required, Validators.maxLength(50)]],
      telefono:       ['', [Validators.required, Validators.maxLength(10)]],
      email:          ['', [Validators.required, Validators.maxLength(50),  Validators.email]],
    });
    this._utilService._loading = true;
    if (this.sessionData.rol === 'superuser') {
      this.superUser = false;
    } else {
      this.sedeActual = this.sessionData.id_sedes;
      this.superUser = true;
    }
  }

  ngOnInit(): void {
    forkJoin({
      escuelas: this.escuelasService.getEscuelas(),
      localidades: this.localidadesService.getLocalidades(),
      municipios: this.municipiosService.getMunicipios(),
      proyectos: this.proyectosService.obtenerTodosLosProyectos(this.sedeActual),
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
    }).add(() => this._utilService._loading = false);
    this.asesoresService.getAsesores().subscribe(data => {
      this.asesores = data;
    } );
  }
  onChangeSedeActual(value) {
    this._utilService._loading = true;
    this.proyectosService.obtenerTodosLosProyectos(value)
      .subscribe(
        data => {
          this.proyectos = data;
        },
        err => console.log(err)
      ).add(() => this._utilService._loading = false);
  }
  reigstrarAutor() {
    this.autoresService.postAutor( this.formRegistroAutores.value )
    .subscribe(
      _ => {
        swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El proyecto se registró correctamente'
        });
        this.formRegistroAutores.reset({
          id_sedes: this.sessionData.id_sedes,
        });
      },
      err => {
        console.log(err);
        swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el proyecto'
        });
      }
    ).add(() => {
      this._utilService.loading = false;
    });
  }

  saveAsPdf(){
    const doc = new jsPDF();
    doc.addImage('assets/image/certificadoJurado.jpg', 'jpg', 0, 0, 210, 300);
    doc.text(this.sessionData['nombre'], 65, 185);
    doc.setFontSize(16);
    doc.setFont('Arial');
    doc.save("constancia.pdf");
    
  }

}
