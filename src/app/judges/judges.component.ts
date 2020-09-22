import { Component, OnInit, ViewChild } from '@angular/core';
import { JudgesRegisteredService } from '../services/judges.service';
import { JudgesRegistered } from '../models/judges.model';
import { UtilsService } from '../services/utils.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Sedes } from '../models/sedes.model';
import { SedesService } from '../services/sedes.service';
import { forkJoin } from 'rxjs';
import { Session } from '../models/session.model';
import { jsPDF } from "jspdf";
import '../../assets/fonts/Helvetica.ttf';
import { Proyectos, ProyectSelect } from '../models/proyectos.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProyectosService } from '../services/proyectos.service';

@Component({
  selector: 'app-judges',
  templateUrl: './judges.component.html',
  styleUrls: ['./judges.component.scss']
})
export class JudgesComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  jueces: JudgesRegistered[];
  juezActual: JudgesRegistered;
  sedes: Sedes[];
  formJuez: FormGroup;
  sessionData: Session;
  proyectos: Proyectos[];
  proyectosViejos: ProyectSelect[];
  proyectosNuevos: Proyectos[];
  settingsProyectosViejos: IDropdownSettings;
  settingsProyectosNuevos: IDropdownSettings;
  constructor(
    private judgesService: JudgesRegisteredService,
    private _utilService: UtilsService,
    private sedesService: SedesService,
    private proyectosService: ProyectosService,
    private formBuilder: FormBuilder
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.jueces = new Array<JudgesRegistered>();
    this.proyectosNuevos = Array<any>();
    this.proyectosViejos = Array<any>();
    this._utilService.loading = true;
    this.formJuez = this.formBuilder.group({
      id_jueces: [''],
      id_categorias: ['', [Validators.required]],
      id_sedes:      [this.sessionData.id_sedes],
      usuario:       ['', [Validators.required]],
      contrasena:    ['', [Validators.required]],
      ids_proyectos_viejos: [''],
      ids_proyectos_nuevos: [''],
      nombre:        ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.settingsProyectosViejos = {
      singleSelection: false,
      idField: 'id_proyectos',
      textField: 'nombre',
      allowSearchFilter: true
    };
    this.settingsProyectosNuevos = {
      singleSelection: false,
      idField: 'id_proyectos',
      textField: 'nombre',
      allowSearchFilter: true
    };
    forkJoin({
      jueces: this.judgesService.getJudgesDetails(),
      sedes: this.sedesService.getSedes(),
      proyectos: this.proyectosService.obtenerTodosLosProyectosCategoria('1'),
    }).subscribe(
      data => {
        this.jueces = data.jueces;
        this.sedes = data.sedes;
        this.proyectos = data.proyectos;
      },
      err => {
        console.log(err);
      }
    ).add(() => {
      this._utilService.loading = false;
    });
  }
  setJudge(juez: JudgesRegistered) {
    this.juezActual = juez;
  }
  deleteJudge() {
    this._utilService._loading = true;
    this.judgesService.deleteJudges(this.juezActual.id_jueces)
      .subscribe(data => {
        Swal.fire({
          title: 'Se elimino correctamente',
          icon: 'success',
        });
      },
        err => {
          console.log(err);
          Swal.fire({
            title: 'Ocurrio un error al eliminar',
            icon: 'error',
          });
        }).add(() => {
          this._utilService._loading = false;
          this.ngOnInit();
        });
  }
  open(juez: JudgesRegistered) {
    this.juezActual = juez;
    this.proyectosService.obtenerProyectosSelect(this.juezActual.id_jueces)
      .subscribe( data => {
        this.proyectosViejos = data;
      });
    this.formJuez.patchValue({
      id_jueces: this.juezActual.id_jueces,
      usuario: this.juezActual.usuario,
      contrasena: this.juezActual.contrasena,
      nombre: this.juezActual.nombre,
      id_sedes: this.sessionData.id_sedes,
      id_categorias: this.verificarCat(this.juezActual.categoria)
    });
    this.swalEdit.fire();
  }
  editarJuez() {
    this._utilService._loading = true;
    this.judgesService.updateJudge(this.formJuez.value)
      .subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: data,
        });
        this.ngOnInit();
      },
        err => {
          console.log(err);
          Swal.fire({
            title: 'Ocurrio un error',
            icon: 'error'
          })
        }).add(() => {
          this._utilService._loading = false;
        });
  }
  dropProyectoViejo(item) {
    this.proyectosViejos.map( (res, index) => {
      if (res.id_proyectos === item.id_proyectos) {
        this.proyectosViejos.splice(index, 1);
      }
    });
  }
  addProyectoViejo(item) {
    this.proyectosViejos.push(item);
  }
  dropProyectoNuevo(item) {
    this.proyectosNuevos.map( (res, index) => {
      if (res.id_proyectos === item.id_proyectos) {
        this.proyectosNuevos.splice(index, 1);
      }
    });
  }
  addProyectoNuevo(item) {
    this.proyectosNuevos.push(item);
  }
  categoriaActual(value) {
    this.proyectosService.obtenerTodosLosProyectosCategoria(value)
      .subscribe( data => {
        this.proyectos = data;
      });
  }
  verificarCat(categoria: string) {
    switch (categoria) {
      case 'petit':
        return 1;
      case 'kids':
        return 2;
      case 'juvenil':
        return 3;
      case 'media superior':
        return 4;
      case 'superior':
        return 5;
      case 'posgrado':
        return 6;
    }
  }
  saveAsPdf(juez: JudgesRegistered) {
    this.juezActual = juez;
    console.log(this.juezActual);
    switch(this.juezActual.sede){
      case 'El mante':
        const doc = new jsPDF();
        doc.addImage('assets/image/ReconocimientoJuradoMante.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc.text(this.juezActual.nombre, 50, 185);
        doc.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Reynosa':
        const doc1 = new jsPDF();
        doc1.addImage('assets/image/ReconocimientoJuradoReynosa.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc1.text(this.juezActual.nombre, 50, 185);
        doc1.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Matamoros':
        const doc2 = new jsPDF();
        doc2.addImage('assets/image/ReconocimientoJuradoMatamoros.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc2.text(this.juezActual.nombre, 50, 185);
        doc2.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Madero':
        const doc3 = new jsPDF();
        doc3.addImage('assets/image/ReconocimientoJuradoMadero.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc3.text(this.juezActual.nombre, 50, 185);
        doc3.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Jaumave':
        const doc4 = new jsPDF();
        doc4.addImage('assets/image/ReconocimientoJuradoJaumave.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc4.text(this.juezActual.nombre, 50, 185);
        doc4.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Nuevo Laredo':
        const doc5 = new jsPDF();
        doc5.addImage('assets/image/ReconocimientoJuradoNuevoLaredo.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc5.text(this.juezActual.nombre, 50, 185);
        doc5.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;
    }
  }
}
