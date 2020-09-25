import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoresService } from '../services/autores.service';
import { UtilsService } from '../services/utils.service';
import { Autores } from '../models/autores.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  sedeActual: string;
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
      nombres:        ['', [Validators.required]],
      a_paterno:      ['', [Validators.required]],
      a_materno:      [''],
      telefono:       ['', [Validators.required]],
      email:          ['', [Validators.required, Validators.email]],
      id_proyectos:   ['', [Validators.required]],
      id_sedes:       ['', [Validators.required]],
      id_escuelas:    ['', [Validators.required]],
      id_municipios:  ['', [Validators.required]],
      id_localidades: ['', [Validators.required]],
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
      sedes: this.sedesService.getSedes(),
      autores: this.superUser
      ? this.autoresService.getAutores()
      : this.autoresService.getAutoresSuperUser()
    }).subscribe(
      data => {
        this.escuelas = data.escuelas;
        this.localidades = data.localidades;
        this.municipios = data.municipios;
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
        Swal.fire({
          title: 'Se elimino correctamente',
          icon: 'success'
        });
      },
        err => {
          console.log(err);
          Swal.fire({
            title: 'Ocurrio un error al eliminar',
            icon: 'error'
          });
        }).add(() => {
          this.utils._loading = false;
          this.ngOnInit();
        });
  }

  onChangeSedeActual(value) {
    this.utils._loading = true;
    this.proyectosService.obtenerTodosLosProyectos(value)
      .subscribe(
        data => {
          this.proyectos = data;
        },
        err => console.log(err)
      ).add(() => this.utils._loading = false);
  }
  openSwal(autor: Autores) {
    this.autorActual = autor;
    this.sedeActual = this.autorActual.id_sedes;
    this.proyectosService.obtenerTodosLosProyectos(this.sedeActual)
      .subscribe (
        data => {
          this.proyectos = data;
        },
        err => console.log(err)
      );

    this.superUser
    ? this.formAutores.patchValue({
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
    })
    : this.formAutores.patchValue({
      nombres:        autor.nombre,
      a_paterno:      autor.a_paterno,
      a_materno:      autor.a_materno,
      telefono:       autor.telefono,
      email:          autor.email,
      id_proyectos:   autor.id_proyectos,
      id_sedes:       autor.id_sedes,
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
        const doc = new jsPDF('p', 'in', 'letter');
        doc.addImage('assets/image/ConstanciaParticipantesMante.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 4.2, 6.9, {align: "center"}).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc.text(this.autorActual.proyecto, 4.2, 8.1, {align: "center"});
        doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 8, 1, 1);
        doc.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '2':
        const doc1 = new jsPDF('p', 'in', 'letter');
        doc1.addImage('assets/image/ConstanciaParticipantesReynosa.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc1.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 4.2, 6.9, {align: "center"}).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc1.text(this.autorActual.proyecto, 4.2, 8.1, {align: "center"});
        doc1.setFontSize(16);
        doc1.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 8, 1, 1);
        doc1.addImage('assets/image/DirectorReynosa.png', 'png', 5.7, 8.2, 1.3, 1);
        doc1.setFont('Helvetica');
        doc1.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '3':
        const doc2 = new jsPDF('p', 'in', 'letter');
        doc2.addImage('assets/image/ConstanciaParticipantesMatamoros.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc2.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 4.2, 6.9, {align: "center"}).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc2.text(this.autorActual.proyecto, 4.2, 8.1, {align: "center"});
        doc2.setFontSize(16);
        doc2.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 8, 1, 1);
        doc2.addImage('assets/image/DirectorMatamoros.png', 'png', 5.7, 8.2, 1.3, 1);
        doc2.setFont('Helvetica');
        doc2.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '4':
        const doc3 = new jsPDF('p', 'in', 'letter');
        doc3.addImage('assets/image/ConstanciaParticipantesMadero.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc3.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 4.2, 6.9, {align: "center"}).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc3.text(this.autorActual.proyecto, 4.2, 8.1, {align: "center"});
        doc3.setFontSize(16);
        doc3.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 8, 1, 1);
        doc3.setFont('Helvetica');
        doc3.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '5':
        const doc4 = new jsPDF('p', 'in', 'letter');
        doc4.addImage('assets/image/ConstanciaParticipantesJaumave.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc4.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 4.2, 6.9, {align: "center"}).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc4.text(this.autorActual.proyecto, 4.2, 8.1, {align: "center"});
        doc4.setFontSize(16);
        doc4.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 8, 1, 1);
        doc4.setFont('Helvetica');
        doc4.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;

      case '6':
        const doc5 = new jsPDF('p', 'in', 'letter');
        doc5.addImage('assets/image/ConstanciaParticipantesNuevoLaredo.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc5.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 4.2, 6.9, {align: "center"}).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc5.text(this.autorActual.proyecto, 4.2, 8.1, {align: "center"});
        doc5.setFontSize(16);
        doc5.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 8, 1, 1);
        doc5.setFont('Helvetica');
        doc5.save("Constancia Autor "+this.autorActual.nombre + "_" + this.autorActual.a_paterno + "_" + this.autorActual.a_materno + ".pdf");
      break;
      case '7':
        const doc6 = new jsPDF('p', 'in', 'letter');
        doc6.addImage('assets/image/ConstanciaParticipantesVictoria.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc6.text(this.titlecasePipe.transform(this.autorActual.nombre)+ " "+ this.titlecasePipe.transform(this.autorActual.a_paterno) + " " + this.titlecasePipe.transform(this.autorActual.a_materno), 4.2, 6.9, {align: "center"}).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
        doc6.text(this.autorActual.proyecto, 4.2, 8.1, {align: "center"});
        doc6.setFontSize(16);
        doc6.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 8, 1, 1);
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
