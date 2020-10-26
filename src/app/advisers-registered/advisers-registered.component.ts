import { Component, OnInit, ViewChild } from '@angular/core';
import { AsesoresService } from '../services/asesores.service';
import { Asesores } from '../models/asesores.model';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';
import { forkJoin } from 'rxjs';
import { Session } from '../models/session.model';
import { jsPDF } from 'jspdf';
import '../../assets/fonts/Helvetica.ttf';
import { TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-advisers-registered',
  templateUrl: './advisers-registered.component.html',
  styleUrls: ['./advisers-registered.component.scss']
})
export class AdvisersRegisteredComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  public asesores: Array<Asesores>;
  asesorActual: Asesores;
  formAsesores: FormGroup;
  sessionData: Session;
  sedes: Sedes[];
  superUser: boolean;
  constructor(
    private _asesoresService: AsesoresService,
    private _utilService: UtilsService,
    private sedesService: SedesService,
    private formBuilder: FormBuilder,
    private titlecasePipe: TitleCasePipe
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this._utilService.loading = true;
    this.formAsesores = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      a_paterno: ['', [Validators.required]],
      a_materno: [''],
      email: ['', [Validators.required, Validators.email]],
      id_sedes: this.sessionData.id_sedes,
      descripcion: ['', [Validators.required]],
    });
    if (this.sessionData.rol === 'superuser') {
      this.superUser = false;
    } else {
      this.superUser = true;
    }
  }

  ngOnInit(): void {
    forkJoin({
      asesores: this.superUser
        ? this._asesoresService.getAsesores()
        : this._asesoresService.getAsesoresSuperUser(),
      sedes: this.sedesService.getSedes()
    }).subscribe(
      data => {
        this.asesores = data.asesores;
        this.sedes = data.sedes;
      }
    ).add(() => {
      this._utilService._loading = false;
    });
  }
  setAsesor(asesor: Asesores) {
    this.asesorActual = asesor;
  }
  deleteAsesor() {
    this._utilService._loading = true;
    this._asesoresService.deleteAsesor(this.asesorActual.id_asesores)
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
          this._utilService._loading = false;
          this.ngOnInit();
        });
  }
  openSwal(asesor: Asesores) {
    this.asesorActual = asesor;
    this.formAsesores.patchValue({
      nombres: asesor.nombres,
      a_paterno: asesor.a_paterno,
      a_materno: asesor.a_materno,
      email: asesor.email,
      id_sedes: this.sessionData.id_sedes,
      descripcion: asesor.descripcion,
    });
    this.swalEdit.fire();
  }
  editarAsesor() {
    this._utilService._loading = true;
    this._asesoresService.updateAsesor(this.formAsesores.value, this.asesorActual.id_asesores)
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
            title: 'Ocurrio un error al editar',
            icon: 'error'
          });
        }).add(() => {
          this._utilService._loading = false;
        });
  }
  saveAsPdf(asesor: any) {
    this.asesorActual = asesor;
    switch (this.asesorActual.id_sedes) {
      case '1':
        for (let i = 0; i < asesor.proyectos.length; i++) {
          const doc = new jsPDF('p', 'in', 'letter');
          doc.addImage('assets/image/certificadoAsesorMante.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
          doc.text(this.titlecasePipe.transform(this.asesorActual.nombres) + " " + this.titlecasePipe.transform(this.asesorActual.a_paterno) + " " + this.titlecasePipe.transform(this.asesorActual.a_materno), 4.2, 6.9, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
          if (asesor.proyectos[i].proyecto.length >= 30 && asesor.proyectos[i].proyecto.length <= 100) {
            let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
            let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, asesor.proyectos[i].proyecto.length);
            doc.text('', 0, 0).setFontSize(14);
            doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.text(nombreTemp2, 4.2, 8.3, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.setFontSize(14);
            doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
            doc.addImage('assets/image/DirectorMante.png', 'png', 5.8, 7.9, 1.4, 1.3);
            doc.setFont('Helvetica');
            doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
          } else {
            if (asesor.proyectos[i].proyecto.length > 100) {
              let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
              let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, 50);
              let nombreTemp3 = asesor.proyectos[i].proyecto.substr(100, asesor.proyectos[i].proyecto.length);
              doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp2, 4.2, 8.25, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp3, 4.2, 8.5, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorMante.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            } else {
              doc.text(asesor.proyectos[i].proyecto, 4.2, 8, { align: "center" });
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorMante.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            }
          }

        }
        break;
      case '2':
        for (let i = 0; i < asesor.proyectos.length; i++) {
          const doc = new jsPDF('p', 'in', 'letter');
          doc.addImage('assets/image/certificadoAsesorReynosa.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
          doc.text(this.titlecasePipe.transform(this.asesorActual.nombres) + " " + this.titlecasePipe.transform(this.asesorActual.a_paterno) + " " + this.titlecasePipe.transform(this.asesorActual.a_materno), 4.2, 6.9, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
          if (asesor.proyectos[i].proyecto.length >= 30 && asesor.proyectos[i].proyecto.length <= 100) {
            let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
            let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, asesor.proyectos[i].proyecto.length);
            doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.text(nombreTemp2, 4.2, 8.3, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.setFontSize(14);
            doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
            doc.addImage('assets/image/DirectorReynosa.png', 'png', 5.8, 7.9, 1.4, 1.3);
            doc.setFont('Helvetica');
            doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
          } else {
            if (asesor.proyectos[i].proyecto.length > 100) {
              let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
              let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, 50);
              let nombreTemp3 = asesor.proyectos[i].proyecto.substr(100, asesor.proyectos[i].proyecto.length);
              doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp2, 4.2, 8.25, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp3, 4.2, 8.5, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorReynosa.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            } else {
              doc.text(asesor.proyectos[i].proyecto, 4.2, 8, { align: "center" });
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorReynosa.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            }
          }

        }
        break;
      case '3':
        for (let i = 0; i < asesor.proyectos.length; i++) {
          const doc = new jsPDF('p', 'in', 'letter');
          doc.addImage('assets/image/certificadoAsesorMatamoros.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
          doc.text(this.titlecasePipe.transform(this.asesorActual.nombres) + " " + this.titlecasePipe.transform(this.asesorActual.a_paterno) + " " + this.titlecasePipe.transform(this.asesorActual.a_materno), 4.2, 6.9, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
          if (asesor.proyectos[i].proyecto.length >= 30 && asesor.proyectos[i].proyecto.length <= 100) {
            let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
            let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, asesor.proyectos[i].proyecto.length);
            doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.text(nombreTemp2, 4.2, 8.3, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.setFontSize(14);
            doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
            doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
            doc.setFont('Helvetica');
            doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
          } else {
            if (asesor.proyectos[i].proyecto.length > 100) {
              let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
              let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, 50);
              let nombreTemp3 = asesor.proyectos[i].proyecto.substr(100, asesor.proyectos[i].proyecto.length);
              doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp2, 4.2, 8.25, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp3, 4.2, 8.5, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            } else {
              doc.text(asesor.proyectos[i].proyecto, 4.2, 8, { align: "center" });
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            }
          }

        }
        break;

      case '4':
        for (let i = 0; i < asesor.proyectos.length; i++) {
          const doc = new jsPDF('p', 'in', 'letter');
          doc.addImage('assets/image/certificadoAsesorMadero.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
          doc.text(this.titlecasePipe.transform(this.asesorActual.nombres) + " " + this.titlecasePipe.transform(this.asesorActual.a_paterno) + " " + this.titlecasePipe.transform(this.asesorActual.a_materno), 4.2, 6.9, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
          if (asesor.proyectos[i].proyecto.length >= 30 && asesor.proyectos[i].proyecto.length <= 100) {
            let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
            let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, asesor.proyectos[i].proyecto.length);
            doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.text(nombreTemp2, 4.2, 8.3, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.setFontSize(14);
            doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
            //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
            doc.setFont('Helvetica');
            doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
          } else {
            if (asesor.proyectos[i].proyecto.length > 100) {
              let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
              let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, 50);
              let nombreTemp3 = asesor.proyectos[i].proyecto.substr(100, asesor.proyectos[i].proyecto.length);
              doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp2, 4.2, 8.25, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp3, 4.2, 8.5, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            } else {
              doc.text(asesor.proyectos[i].proyecto, 4.2, 8, { align: "center" });
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            }
          }

        }
        break;
      case '5':
        for (let i = 0; i < asesor.proyectos.length; i++) {
          const doc = new jsPDF('p', 'in', 'letter');
          doc.addImage('assets/image/certificadoAsesorJaumave.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
          doc.text(this.titlecasePipe.transform(this.asesorActual.nombres) + " " + this.titlecasePipe.transform(this.asesorActual.a_paterno) + " " + this.titlecasePipe.transform(this.asesorActual.a_materno), 4.2, 6.9, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
          if (asesor.proyectos[i].proyecto.length >= 30 && asesor.proyectos[i].proyecto.length <= 100) {
            let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
            let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, asesor.proyectos[i].proyecto.length);
            doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.text(nombreTemp2, 4.2, 8.3, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.setFontSize(14);
            doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
            //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
            doc.setFont('Helvetica');
            doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
          } else {
            if (asesor.proyectos[i].proyecto.length > 100) {
              let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
              let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, 50);
              let nombreTemp3 = asesor.proyectos[i].proyecto.substr(100, asesor.proyectos[i].proyecto.length);
              doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp2, 4.2, 8.25, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp3, 4.2, 8.5, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            } else {
              doc.text(asesor.proyectos[i].proyecto, 4.2, 8, { align: "center" });
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            }
          }

        }
        break;
      case '6':
        for (let i = 0; i < asesor.proyectos.length; i++) {
          const doc = new jsPDF('p', 'in', 'letter');
          doc.addImage('assets/image/certificadoAsesorNuevoLaredo.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
          doc.text(this.titlecasePipe.transform(this.asesorActual.nombres) + " " + this.titlecasePipe.transform(this.asesorActual.a_paterno) + " " + this.titlecasePipe.transform(this.asesorActual.a_materno), 4.2, 6.9, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
          if (asesor.proyectos[i].proyecto.length >= 30 && asesor.proyectos[i].proyecto.length <= 100) {
            let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
            let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, asesor.proyectos[i].proyecto.length);
            doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.text(nombreTemp2, 4.2, 8.3, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.setFontSize(14);
            doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
            //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
            doc.setFont('Helvetica');
            doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
          } else {
            if (asesor.proyectos[i].proyecto.length > 100) {
              let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
              let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, 50);
              let nombreTemp3 = asesor.proyectos[i].proyecto.substr(100, asesor.proyectos[i].proyecto.length);
              doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp2, 4.2, 8.25, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp3, 4.2, 8.5, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            } else {
              doc.text(asesor.proyectos[i].proyecto, 4.2, 8, { align: "center" });
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              //doc.addImage('assets/image/DirectorMatamoros.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            }
          }

        }
        break;
      case '7':
        for (let i = 0; i < asesor.proyectos.length; i++) {
          const doc = new jsPDF('p', 'in', 'letter');
          doc.addImage('assets/image/certificadoAsesorVictoria.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
          doc.text(this.titlecasePipe.transform(this.asesorActual.nombres) + " " + this.titlecasePipe.transform(this.asesorActual.a_paterno) + " " + this.titlecasePipe.transform(this.asesorActual.a_materno), 4.2, 6.9, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
          if (asesor.proyectos[i].proyecto.length >= 30 && asesor.proyectos[i].proyecto.length <= 100) {
            let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
            let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, asesor.proyectos[i].proyecto.length);
            doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.text(nombreTemp2, 4.2, 8.3, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
            doc.setFontSize(14);
            doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
            doc.addImage('assets/image/DirectorVictoria.png', 'png', 5.8, 7.9, 1.4, 1.3);
            doc.setFont('Helvetica');
            doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
          } else {
            if (asesor.proyectos[i].proyecto.length > 100) {
              let nombreTemp = asesor.proyectos[i].proyecto.substr(0, 50);
              let nombreTemp2 = asesor.proyectos[i].proyecto.substr(50, 50);
              let nombreTemp3 = asesor.proyectos[i].proyecto.substr(100, asesor.proyectos[i].proyecto.length);
              doc.text(nombreTemp, 4.2, 8, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp2, 4.2, 8.25, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.text(nombreTemp3, 4.2, 8.5, { align: "center" }).setFontSize(14).setFont('Helvetica').setTextColor('#646464');
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorVictoria.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            } else {
              doc.text(asesor.proyectos[i].proyecto, 4.2, 8, { align: "center" });
              doc.setFontSize(14);
              doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
              doc.addImage('assets/image/DirectorVictoria.png', 'png', 5.8, 7.9, 1.4, 1.3);
              doc.setFont('Helvetica');
              doc.save("constancia Asesor " + this.asesorActual.nombres + " Proyecto " + asesor.proyectos[i].proyecto + ".pdf");
            }
          }

        }
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
