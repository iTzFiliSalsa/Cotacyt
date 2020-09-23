import { Component, OnInit, ViewChild } from '@angular/core';
import { AsesoresService } from '../services/asesores.service';
import { Asesores } from '../models/asesores.model';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';
import { forkJoin } from 'rxjs';
import { Session } from '../models/session.model';
import { jsPDF } from "jspdf";
import '../../assets/fonts/Helvetica.ttf';


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
  constructor(
    private _asesoresService: AsesoresService,
    private _utilService: UtilsService,
    private sedesService: SedesService,
    private formBuilder: FormBuilder
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this._utilService.loading = true;
    this.formAsesores = this.formBuilder.group({
      nombres:     [''],
      a_paterno:   [''],
      a_materno:   [''],
      email:       [''],
      id_sedes:    this.sessionData.id_sedes,
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    forkJoin({
      asesores: this._asesoresService.getAsesores(),
      sedes: this.sedesService.getSedes()
    }).subscribe(
      data => {
        console.log(data.asesores);
        this.asesores = data.asesores;
        this.sedes = data.sedes;
        console.log(this.asesores);
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
      .subscribe( data => {
        Swal.fire({
          title: 'Se elimino el asesor correctamente',
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
      nombres:     asesor.nombres,
      a_paterno:   asesor.a_paterno,
      a_materno:   asesor.a_materno,
      email:       asesor.email,
      id_sedes:    this.sessionData.id_sedes,
      descripcion: asesor.descripcion,
    });
    this.swalEdit.fire();
  }
  editarAsesor() {
    this._utilService._loading = true;
    this._asesoresService.updateAsesor( this.formAsesores.value, this.asesorActual.id_asesores )
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
  saveAsPdf(asesor: any){
    this.asesorActual = asesor;
    console.log(this.asesorActual);
  switch(this.asesorActual.id_sedes){
    case '1':
      for (let i = 0; i < asesor.proyectos.length; i++) {
      const doc = new jsPDF();
      doc.addImage('assets/image/certificadoAsesorMante.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
      doc.text(this.asesorActual.nombres+ " "+ this.asesorActual.a_paterno + " " + this.asesorActual.a_materno , 45, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc.text(asesor.proyectos[i], 80, 225);
      doc.setFontSize(16);
      doc.setFont('Helvetica');
      doc.save("constancia Asesor "+this.asesorActual.nombres+" Proyecto "+asesor.proyectos[i]+".pdf");
      }
    break;
    case '2':
      for (let i = 0; i < asesor.proyectos.length; i++) {
      const doc1 = new jsPDF();
      doc1.addImage('assets/image/certificadoAsesorReynosa.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
    doc1.text(this.asesorActual.nombres+ " "+ this.asesorActual.a_paterno + " " + this.asesorActual.a_materno , 45, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc1.text(asesor.proyectos[i], 80, 225);
      doc1.setFontSize(16);
      doc1.setFont('Helvetica');
      doc1.save("constancia Asesor "+this.asesorActual.nombres+" Proyecto "+asesor.proyectos[i]+".pdf");
      }
    break;
    case '3':
      for (let i = 0; i < asesor.proyectos.length; i++) {
      const doc2 = new jsPDF();
      doc2.addImage('assets/image/certificadoAsesorMatamoros.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');     
      doc2.text(this.asesorActual.nombres+ " "+ this.asesorActual.a_paterno + " " + this.asesorActual.a_materno , 45, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc2.text(asesor.proyectos[i], 80, 225);
      doc2.setFontSize(16);
      doc2.setFont('Helvetica');
      doc2.save("constancia Asesor "+this.asesorActual.nombres+" Proyecto "+asesor.proyectos[i]+".pdf");
      }
    break;
    case '4':
      for (let i = 0; i < asesor.proyectos.length; i++) {
      const doc3 = new jsPDF();
      doc3.addImage('assets/image/certificadoAsesorMadero.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
     doc3.text(this.asesorActual.nombres+ " "+ this.asesorActual.a_paterno + " " + this.asesorActual.a_materno , 45, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc3.text(asesor.proyectos[i], 80, 225);
      doc3.setFontSize(16);
      doc3.setFont('Helvetica');
      doc3.save("constancia Asesor "+this.asesorActual.nombres+" Proyecto "+asesor.proyectos[i]+".pdf");
      }
    break;
    case '5':
      for (let i = 0; i < asesor.proyectos.length; i++) {
      const doc4 = new jsPDF();
      doc4.addImage('assets/image/certificadoAsesorJaumave.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
    doc4.text(this.asesorActual.nombres+ " "+ this.asesorActual.a_paterno + " " + this.asesorActual.a_materno , 45, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc4.text(asesor.proyectos[i], 80, 225);
      doc4.setFontSize(16);
      doc4.setFont('Helvetica');
      doc4.save("constancia Asesor "+this.asesorActual.nombres+" Proyecto "+asesor.proyectos[i]+".pdf");
      }
    break;
    case '6':
      for (let i = 0; i < asesor.proyectos.length; i++) {
      const doc5 = new jsPDF();
      doc5.addImage('assets/image/certificadoAsesorNuevoLaredo.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
      doc5.text(this.asesorActual.nombres+ " "+ this.asesorActual.a_paterno + " " + this.asesorActual.a_materno , 45, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc5.text(asesor.proyectos[i], 80, 225);
      doc5.setFontSize(16);
      doc5.setFont('Helvetica');
      doc5.save("constancia Asesor "+this.asesorActual.nombres+" Proyecto "+asesor.proyectos[i]+".pdf");
      }
    break;
    case '7':
      for (let i = 0; i < asesor.proyectos.length; i++) {
      const doc6 = new jsPDF();
      doc6.addImage('assets/image/certificadoAsesorVictoria.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
     doc6.text(this.asesorActual.nombres+ " "+ this.asesorActual.a_paterno + " " + this.asesorActual.a_materno , 45, 187).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc6.text(asesor.proyectos[i], 80, 225);
      doc6.setFontSize(16);
      doc6.setFont('Helvetica');
      doc6.save("constancia Asesor "+this.asesorActual.nombres+" Proyecto "+asesor.proyectos[i]+".pdf");
      }
    break;
    default:
      console.log('sede no encontrada');
    break;
      

}
  }
}
