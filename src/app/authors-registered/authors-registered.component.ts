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
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';
import { Session } from '../models/session.model';
import { jsPDF } from "jspdf";
import '../../assets/fonts/Helvetica.ttf';
import { TitleCasePipe } from '@angular/common';


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
  sedes: Sedes[];
  proyectos: Proyectos[];
  sessionData: Session;
  superUser: boolean;
  constructor(
    private municipiosService: MunicipiosService,
    private escuelasService: EscuelasService,
    private localidadesService: LocalidadesService,
    private proyectosService: ProyectosService,
    private autoresService: AutoresService,
    private utils: UtilsService,
    private sedesService: SedesService,
    private formBuilder: FormBuilder,
    private titlecasePipe:TitleCasePipe 
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.formAutores = this.formBuilder.group({
      nombres: [''],
      a_paterno: [''],
      a_materno: [''],
      telefono: [''],
      email: [''],
      id_proyectos: [''],
      id_sedes: this.sessionData.id_jueces,
      id_escuelas: [''],
      id_municipios: [''],
      id_localidades: [''],
    });
    this.utils._loading = true;
    if (this.sessionData.rol === 'superuser') {
      this.superUser = false;
    } else {
      this.superUser = true;
    }
  }

  ngOnInit(): void {
    forkJoin({
      escuelas: this.escuelasService.getEscuelas(),
      localidades: this.localidadesService.getLocalidades(),
      municipios: this.municipiosService.getMunicipios(),
      proyectos: this.superUser
      ? this.proyectosService.obtenerTodosLosProyectos()
      : this.proyectosService.obtenerProyectosSuperUser('1'),
      sedes: this.sedesService.getSedes(),
      autores: this.superUser
      ? this.autoresService.getAutores()
      : this.autoresService.getAutoresSelectSuperUser()
    }).subscribe(
      data => {
        this.escuelas = data.escuelas;
        this.localidades = data.localidades;
        this.municipios = data.municipios;
        this.proyectos = data.proyectos;
        this.autores = data.autores;
        this.sedes = data.sedes;
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
    this.formAutores.patchValue({
      nombres:        autor.nombre,
      a_paterno:      autor.a_paterno,
      a_materno:      autor.a_materno,
      telefono:       autor.telefono,
      email:          autor.email,
      id_proyectos:   autor.id_proyectos,
      id_sedes:       this.sessionData.id_sedes,
      id_escuelas:    autor.id_escuelas,
      id_municipios:  autor.id_municipios,
      id_localidades: autor.id_localidades,
    });
    this.swalEdit.fire();
  }

  editarAutor() {
    this.utils._loading = true;
    this.autoresService.updateAutor(this.formAutores.value, this.autorActual.id_autores)
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

  saveAsPdf(autor: Autores) {
    this.autorActual = autor;
    switch (this.autorActual.id_sedes) {
      case '1':
        const doc = new jsPDF();
        doc.addImage('assets/image/ConstanciaParticipantesMante.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 22, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc.text(this.autorActual.proyecto, 72, 225);
        doc.addImage('assets/image/DirectorGeneral.png', 'png', 40, 223, 36, 20);
        doc.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '2':
        const doc1 = new jsPDF();
        doc1.addImage('assets/image/ConstanciaParticipantesReynosa.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc1.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 22, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc1.text(this.autorActual.proyecto, 72, 225);
        doc1.setFontSize(16);
        doc1.addImage('assets/image/DirectorGeneral.png', 'png', 40, 223, 36, 20);
        doc1.addImage('assets/image/DirectorReynosa.png', 'png', 140, 223, 36, 20);
        doc1.setFont('Helvetica');
        doc1.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '3':
        const doc2 = new jsPDF();
        doc2.addImage('assets/image/ConstanciaParticipantesMatamoros.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc2.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 22, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc2.text(this.autorActual.proyecto, 72, 225);
        doc2.setFontSize(16);
        doc2.addImage('assets/image/DirectorGeneral.png', 'png', 40, 223, 36, 20);
        doc2.addImage('assets/image/DirectorMatamoros.png', 'png', 140, 221, 36, 20);
        doc2.setFont('Helvetica');
        doc2.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '4':
        const doc3 = new jsPDF();
        doc3.addImage('assets/image/ConstanciaParticipantesMadero.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc3.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 22, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc3.text(this.autorActual.proyecto, 72, 225);
        doc3.setFontSize(16);
        doc3.addImage('assets/image/DirectorGeneral.png', 'png', 40, 223, 36, 20);
        doc3.setFont('Helvetica');
        doc3.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '5':
        const doc4 = new jsPDF();
        doc4.addImage('assets/image/ConstanciaParticipantesJaumave.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc4.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 22, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc4.text(this.autorActual.proyecto, 72, 225);
        doc4.setFontSize(16);
        doc4.addImage('assets/image/DirectorGeneral.png', 'png', 40, 223, 36, 20);
        doc4.setFont('Helvetica');
        doc4.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;

      case '6':
        const doc5 = new jsPDF();
        doc5.addImage('assets/image/ConstanciaParticipantesNuevoLaredo.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc5.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 22, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc5.text(this.autorActual.proyecto, 72, 225);
        doc5.setFontSize(16);
        doc5.addImage('assets/image/DirectorGeneral.png', 'png', 40, 223, 36, 20);
        doc5.setFont('Helvetica');
        doc5.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '7':
        const doc6 = new jsPDF();
        doc6.addImage('assets/image/ConstanciaParticipantesVictoria.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc6.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 22, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc6.text(this.autorActual.proyecto, 72, 225);
        doc6.setFontSize(16);
        doc6.addImage('assets/image/DirectorGeneral.png', 'png', 40, 223, 36, 20);
        doc6.setFont('Helvetica');
        doc6.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      default:
        console.log('sede no encontrada');
        Swal.fire({
          icon: 'error',
          title: 'No se encontró la sede'
        });
        break;
    }
}
}
