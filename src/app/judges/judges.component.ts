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
import { TitleCasePipe } from '@angular/common';



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
  superUser: boolean;
  categoriaActual = '1';
  sedeActual = '1';
  constructor(
    private judgesService: JudgesRegisteredService,
    private _utilService: UtilsService,
    private sedesService: SedesService,
    private proyectosService: ProyectosService,
    private formBuilder: FormBuilder,
    private titlecasePipe:TitleCasePipe 
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.jueces = new Array<JudgesRegistered>();
    this.proyectosNuevos = new Array<any>();
    this.proyectosViejos = new Array<any>();
    this._utilService.loading = true;
    this.formJuez = this.formBuilder.group({
      id_jueces:            [''],
      id_categorias:        ['', [Validators.required]],
      id_sedes:             ['', [Validators.required]],
      usuario:              ['', [Validators.required]],
      contrasena:           ['', [Validators.required]],
      ids_proyectos_viejos: [''],
      ids_proyectos_nuevos: [''],
      nombre:               ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.sessionData.rol === 'superuser') {
      this.superUser = false;
    } else {
      this.superUser = true;
    }
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
    if (this.sessionData.rol === 'superuser') {
      forkJoin({
        jueces: this.judgesService.getJudgesSueperUser(),
        sedes: this.sedesService.getSedes(),
        proyectos: this.proyectosService.obtenerProyectosSuperUser('1'),
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
    } else {
      forkJoin({
        jueces: this.judgesService.getJudgesDetails(),
        sedes: this.sedesService.getSedes(),
      }).subscribe(
        data => {
          this.jueces = data.jueces;
          this.sedes = data.sedes;
        },
        err => {
          console.log(err);
        }
      ).add(() => {
        this._utilService.loading = false;
      });
    }
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
    this._utilService._loading = true;
    forkJoin({
      proyectos: this.superUser
      ? this.proyectosService.obtenerTodosLosProyectosCategoria(this.juezActual.id_categorias)
      : this.proyectosService.obtenerProyectosSuperUser(this.juezActual.id_categorias),
      proyectosViejos: this.proyectosService.obtenerProyectosSelect(this.juezActual.id_categorias)
    }).subscribe(
      data => {
        this.proyectos = data.proyectos;
        this.proyectosViejos = data.proyectosViejos;
      }
    ).add(() => this._utilService._loading = false);
    this.superUser
    ? this.formJuez.patchValue({
      id_jueces: this.juezActual.id_jueces,
      usuario: this.juezActual.usuario,
      contrasena: this.juezActual.contrasena,
      nombre: this.juezActual.nombre,
      id_sedes: this.sessionData.id_sedes,
      id_categorias: this.verificarCat(this.juezActual.categoria)
    })
    : this.formJuez.patchValue({
      id_jueces: this.juezActual.id_jueces,
      usuario: this.juezActual.usuario,
      contrasena: this.juezActual.contrasena,
      nombre: this.juezActual.nombre,
      id_sedes: this.juezActual.id_sedes,
      id_categorias: this.verificarCat(this.juezActual.categoria)
    });
    this.swalEdit.fire().then(
      res => {
        if (res.dismiss === Swal.DismissReason.backdrop) {
          this.vaciarInfo();
        }
      },
      err => {
        console.error(err);
      }
    );
  }
  vaciarInfo() {
    this.proyectosNuevos = [];
    this.proyectosViejos = [];
    this.proyectos = [];
    console.log(this.proyectosNuevos, this.proyectosViejos);
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
        this.vaciarInfo();
      },
        err => {
          console.log(err);
          Swal.fire({
            title: 'Ocurrio un error',
            icon: 'error'
          });
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
  onChangeSedeActual(value) {
    this._utilService._loading = true;
    this.sedeActual = value;
    this.proyectosService.obtenerProyectosSuperUserTemp(this.categoriaActual, value)
    .subscribe( data => {
      this.proyectos = data;
    }).add(() => this._utilService._loading = false);
  }
  onChangeCategoriaActual(value) {
    this._utilService._loading = true;
    this.categoriaActual = value;
    if (this.sessionData.rol === 'superuser') {
      this.proyectosService.obtenerProyectosSuperUserTemp(value, this.sedeActual)
      .subscribe( data => {
        this.proyectos = data;
      }).add(() => this._utilService._loading = false);
    } else {
      this.proyectosService.obtenerTodosLosProyectosCategoria(value)
      .subscribe( data => {
        this.proyectos = data;
      }).add(() => this._utilService._loading = false);
    }
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
    switch(this.juezActual.sede){
      case 'El mante':
        const doc = new jsPDF('p', 'in', 'letter');
        doc.addImage('assets/image/ReconocimientoJuradoMante.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc.text(this.titlecasePipe.transform(this.juezActual.nombre), 4.2, 6.6, {align: "center"});
        doc.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
        doc.addImage('assets/image/DirectorMante.png', 'png', 5.7, 8, 1.3, 1);
        doc.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Reynosa':
        const doc1 = new jsPDF('p', 'in', 'letter');
        doc1.addImage('assets/image/ReconocimientoJuradoReynosa.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc1.text(this.titlecasePipe.transform(this.juezActual.nombre), 4.2, 6.6, {align: "center"});
        doc1.addImage('assets/image/DirectorReynosa.png', 'png', 5.7, 7.8, 1.3, 1.3);
        doc1.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
        doc1.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Matamoros':
        const doc2 = new jsPDF('p', 'in', 'letter');
        doc2.addImage('assets/image/ReconocimientoJuradoMatamoros.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc2.text(this.titlecasePipe.transform(this.juezActual.nombre), 4.2, 6.6, {align: "center"});
        doc2.addImage('assets/image/DirectorMatamoros.png', 'png', 5.7, 8, 1.3, 1);
        doc2.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
        doc2.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Madero':
        const doc3 = new jsPDF('p', 'in', 'letter');
        doc3.addImage('assets/image/ReconocimientoJuradoMadero.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc3.text(this.titlecasePipe.transform(this.juezActual.nombre), 4.2, 6.6, {align: "center"});
        doc3.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Jaumave':
        const doc4 = new jsPDF('p', 'in', 'letter');
        doc4.addImage('assets/image/ReconocimientoJuradoJaumave.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc4.text(this.titlecasePipe.transform(this.juezActual.nombre), 4.2, 6.73, {align: "center"});
        doc4.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;

      case 'Nuevo Laredo':
        const doc5 = new jsPDF('p', 'in', 'letter');
        doc5.addImage('assets/image/ReconocimientoJuradoNuevoLaredo.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc5.text(this.titlecasePipe.transform(this.juezActual.nombre), 4.2, 6.6, {align: "center"});
        doc5.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;
      case 'Victoria':
        const doc6 = new jsPDF('p', 'in', 'letter');
        doc6.addImage('assets/image/ReconocimientoJuradoVictoria.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
        doc6.text(this.titlecasePipe.transform(this.juezActual.nombre), 4.2, 6.6, {align: "center"});
        doc6.addImage('assets/image/DirectorGeneral.png', 'png', 1.8, 7.8, 1.3, 1.3);
        doc1.addImage('assets/image/DirectorVictoria.png', 'png', 5.7, 8, 1.3, 1);
        doc6.save("constancia Juez "+this.juezActual.nombre+".pdf");
      break;
      default:
        Swal.fire({
          icon: 'error',
          title: 'No se encontró la sede'
        });
      break;
    }
  }
}

