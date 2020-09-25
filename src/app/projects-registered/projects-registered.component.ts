import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsRegisteredService } from '../services/project-registered.service'
import { ProjectRegistered } from '../models/project-regis.model';
import { UtilsService } from '../services/utils.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Areas } from '../models/areas.model';
import { Sedes } from '../models/sedes.model';
import { Asesores } from '../models/asesores.model';
import { Categorias } from '../models/categorias.model';
import { SedesService } from '../services/sedes.service';
import { AreasService } from '../services/areas.service';
import { CategoriasService } from '../services/categorias.service';
import { AsesoresService } from '../services/asesores.service';
import { forkJoin } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Proyectos } from '../models/proyectos.model';
import { ProyectosService } from '../services/proyectos.service';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Session } from '../models/session.model';
import { jsPDF } from "jspdf";
import { Autores, AutoresSelect } from '../models/autores.model';
import { AutoresService } from '../services/autores.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-projects-registered',
  templateUrl: './projects-registered.component.html',
  styleUrls: ['./projects-registered.component.scss']
})
export class ProjectsRegisteredComponent implements OnInit {

  @ViewChild('swalid') private swalEdit: SwalComponent;
  proyectos: ProjectRegistered[];
  proyectoActual: ProjectRegistered;
  formProyecto: FormGroup;
  areas: Areas[];
  sedes: Sedes[];
  autoresViejos: AutoresSelect[];
  autores: AutoresSelect[];
  autoresSeleccionados: any[];
  autoresViejosSeleccionados: any[];
  settingsAutoresNuevos: IDropdownSettings;
  settingsAutoresViejos: IDropdownSettings;
  asesores: Asesores[];
  categorias: Categorias[];
  lenght: number;
  agregado: number;
  superUser: boolean;
  sessionData: Session;
  sedeActual = '1';
  constructor(
    private projectsService: ProjectsRegisteredService,
    private _utilService: UtilsService,
    private formBuilder: FormBuilder,
    private sedesService: SedesService,
    private autoresService: AutoresService,
    private areasService: AreasService,
    private asesoresService: AsesoresService,
    private categoriasServices: CategoriasService,
    private router: Router,
    private obtenerProyecto: ProyectosService
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.proyectos = new Array<ProjectRegistered>();
    this.areas = new Array<Areas>();
    this.sedes = new Array<Sedes>();
    this.lenght = 0;
    this.autoresViejos = new Array<AutoresSelect>();
    this.autoresViejosSeleccionados = new Array<AutoresSelect>();
    this.autores = new Array<AutoresSelect>();
    this.asesores = new Array<Asesores>();
    this.categorias = new Array<Categorias>();
    this.autoresSeleccionados = new Array<any>();
    this._utilService.loading = true;
    this.formProyecto = this.formBuilder.group({
      id_proyectos:  [''],
      id_asesores:   ['', [Validators.required]],
      id_areas:      ['', [Validators.required]],
      id_sedes:      this.sessionData.id_sedes,
      id_categorias: ['', [Validators.required]],
      ids_autores_viejos: [''],
      ids_autores_nuevos : [''],
      nombre:        ['', [Validators.required]],
      resumen:       ['', [Validators.required]],
    });
    if (this.sessionData.rol === 'superuser') {
      this.superUser = false;
    } else {
      this.superUser = true;
    }
  }

  ngOnInit(): void {
    forkJoin(
      {
        areas: this.areasService.getAreas(),
        sedes: this.sedesService.getSedes(),
        autores: this.superUser
        ? this.autoresService.getAutoresSelect()
        :  this.autoresService.getAutoresSelectSuperUser(this.sedeActual),
        categorias: this.categoriasServices.getAllCategrias(),
        asesores: this.asesoresService.getAsesores(),
        proyectos: this.superUser
        ? this.projectsService.obtenerTodosLosProyectosDetallesAdmin()
        : this.projectsService.obtenerTodosLosProyectosDetalles()
      }
    ).subscribe(
      data => {
        this.areas = data.areas;
        this.sedes = data.sedes;
        this.autores = data.autores;
        this.categorias = data.categorias;
        this.asesores = data.asesores;
        this.proyectos = data.proyectos;

        this.settingsAutoresNuevos = {
          singleSelection: false,
          idField: 'id_autores',
          textField: 'nombre',
          itemsShowLimit: 3,
          limitSelection: 3,
          allowSearchFilter: true
        };
      },
      err => console.log(err)
    ).add(() => {
      this._utilService._loading = false;
    });
  }
  setProyectoActual(proyecto: ProjectRegistered) {
    this.proyectoActual = proyecto;
  }
  deleteProyectRegistred() {
    this._utilService.loading = true;
    this.projectsService.deleteProyectsRegistred(this.proyectoActual.id_proyectos)
      .subscribe(data => {
        Swal.fire({
          title: 'Se elimino correctamente',
          icon: 'success'
        });
        this.ngOnInit();
      },
        err => {
          console.log(err);
          Swal.fire({
            title: 'Ocurrio un error',
            icon: 'error',
          });
        }
      ).add(() => {
        this._utilService.loading = false;
      });
  }
  onChangeSedeActual(value) {
    this._utilService._loading = true;
    this.autoresService.getAutoresSelectSuperUser(value)
      .subscribe(
        data => {
          this.autores = data;
        },
        err => {
          console.log(err);
        }
      ).add(() => this._utilService._loading = false);
  }
  openSwal(proyecto: ProjectRegistered) {
    this.proyectoActual = proyecto;
    this.obtenerProyecto.getAutoresProyecto(this.proyectoActual.id_proyectos)
    .subscribe( data => {
      this.autoresViejos = data;
      this.agregado = (3 - this.autoresViejos.length);
      this.settingsAutoresViejos = {
        singleSelection: false,
        idField: 'id_autores',
        textField: 'nombre',
        itemsShowLimit: 3,
        limitSelection: this.autoresViejos.length,
        allowSearchFilter: true
      };
    });
    this.obtenerProyecto.obtenerProyecto(proyecto.id_proyectos).subscribe(
      data => {
        this.superUser
        ? this.formProyecto.patchValue({
          id_proyectos:  data.id_proyectos,
          id_asesores:   data.id_asesores,
          id_areas:      data.id_areas,
          id_sedes:      this.sessionData.id_sedes,
          id_categorias: data.id_categorias,
          nombre:        data.nombre,
          resumen:       data.resumen,
        })
        : this.formProyecto.patchValue({
          id_proyectos:  data.id_proyectos,
          id_asesores:   data.id_asesores,
          id_areas:      data.id_areas,
          id_sedes:      data.id_sedes,
          id_categorias: data.id_categorias,
          nombre:        data.nombre,
          resumen:       data.resumen,
        });
      }, err => {
        console.log(err);
        Swal.fire({
          title: 'Ocurrio un error al obter los datos',
          icon: 'error'
        });
      }
    );
    this.swalEdit.fire();
  }
  editarProyecto() {
    console.log(this.formProyecto.value);
    this.projectsService.updateProyect( this.formProyecto.value)
    .subscribe( data => {
      Swal.fire({
        icon: 'success',
        title: data,
      });
      this.ngOnInit();
      this.autoresSeleccionados = Array<AutoresSelect>();
      this.autoresViejosSeleccionados = Array<AutoresSelect>();
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'ocurrio un error al actualizar',
      });
    });
  }
  addAutor(item: any) {
    this.autoresSeleccionados.push(item);
  }
  dropAutor(item: { id_autores: any; }) {
    this.autoresSeleccionados.map( (res, index) => {
      if (res.id_autores === item.id_autores) {
        this.autoresSeleccionados.splice(index, 1);
      }
    });
  }
  addAutorViejo(item: AutoresSelect) {
    this.autoresViejosSeleccionados.push(item);
    this.lenght = (this.autoresViejosSeleccionados.length + this.agregado);
    this.settingsAutoresNuevos = Object.assign({}, this.settingsAutoresNuevos, {limitSelection: this.lenght});
  }
  dropAutorViejo(item: AutoresSelect) {
    this.autoresViejosSeleccionados.map( (res, index) => {
      if (res.id_autores === item.id_autores) {
        this.autoresViejosSeleccionados.splice(index, 1);
        this.lenght = (this.autoresViejosSeleccionados.length +  this.agregado);
        this.settingsAutoresNuevos = Object.assign({}, this.settingsAutoresNuevos, {limitSelection: this.lenght});
      }
    });
  }
  saveAsPdf(proyecto: ProjectRegistered){
    this.proyectoActual = proyecto;
    console.log(this.proyectoActual);
    switch(this.proyectoActual.sede){
      case 'El mante':
        const doc = new jsPDF();
        doc.addImage('assets/image/certificadoJurado.jpg', 'jpg', 0, 0, 210, 300);
        doc.text(this.proyectoActual.asesor , 65, 185);
        doc.text(this.proyectoActual.nombre, 80, 225);
        doc.setFontSize(16);
        doc.setFont('Helvetica');
        doc.save("constanciaAsesor.pdf");
      break;
      case 'Reynosa':
        const doc1 = new jsPDF();
        doc1.addImage('assets/image/certificadoJurado.jpg', 'jpg', 0, 0, 210, 300);
        doc1.text(this.proyectoActual.asesor , 65, 185);
        doc1.text(this.proyectoActual.nombre, 80, 225);
        doc1.setFontSize(16);
        doc1.setFont('Helvetica');
        doc1.save("constanciaAsesor.pdf");
      break;
      case 'Matamoros':
        const doc2 = new jsPDF();
        doc2.addImage('assets/image/certificadoJurado.jpg', 'jpg', 0, 0, 210, 300);
        doc2.text(this.proyectoActual.asesor , 65, 185);
        doc2.text(this.proyectoActual.nombre, 80, 225);
        doc2.setFontSize(16);
        doc2.setFont('Helvetica');
        doc2.save("constanciaAsesor.pdf");
      break;
      case 'Madero':
        const doc3 = new jsPDF();
        doc3.addImage('assets/image/certificadoJurado.jpg', 'jpg', 0, 0, 210, 300);
        doc3.text(this.proyectoActual.asesor , 65, 185);
        doc3.text(this.proyectoActual.nombre, 80, 225);
        doc3.setFontSize(16);
        doc3.setFont('Helvetica');
        doc3.save("constanciaAsesor.pdf");
      break;
      case 'Jaumave':
        const doc4 = new jsPDF();
        doc4.addImage('assets/image/certificadoJurado.jpg', 'jpg', 0, 0, 210, 300);
        doc4.text(this.proyectoActual.asesor , 65, 185);
        doc4.text(this.proyectoActual.nombre, 80, 225);
        doc4.setFontSize(16);
        doc4.setFont('Helvetica');
        doc4.save("constanciaAsesor.pdf");
      break;
      case 'Nuevo Laredo':
        const doc5 = new jsPDF();
        doc5.addImage('assets/image/certificadoJurado.jpg', 'jpg', 0, 0, 210, 300);
        doc5.text(this.proyectoActual.asesor , 65, 185);
        doc5.text(this.proyectoActual.nombre, 80, 225);
        doc5.setFontSize(16);
        doc5.setFont('Helvetica');
        doc5.save("constanciaAsesor.pdf");
      break;
    }
    
    
    
  }
}
