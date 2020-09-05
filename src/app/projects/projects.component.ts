import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ProyectosCalificados, ProyectosPorCalificar } from '../models/dashboard.model';
import { ServicesConfig } from '../config/services.config';
import { CategoriasService } from '../services/categorias.service';
import { ProyectosService } from '../services/proyectos.service';
import { Proyectos } from '../models/proyectos.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalificarProyectoService } from '../services/calificar-proyecto.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public isCollapsed = true;

  categoria: string;
  proyectosCalificados: ProyectosCalificados[];
  proyectosPorCalificar: ProyectosPorCalificar[];
  proyectoActual: Proyectos;
  formPuntos: FormGroup;
  valores: {};
  obtenido1: string;
  obtenido2: string;
  obtenido3: string;
  obtenido4: string;
  obtenido5: string;
  obtenido6: string;
  obtenido7: string;
  obtenido8: string;
  obtenido9: string;
  constructor(private dashboardService: DashboardService,
              private categoriasService: CategoriasService,
              private proyectosService: ProyectosService,
              private formBuilder: FormBuilder,
              private calificarProyectoService: CalificarProyectoService,
              private _utilService: UtilsService
              ) {
    this.proyectosCalificados = new Array<ProyectosCalificados>();
    this.obtenido1 = '';
    this.obtenido2 = '';
    this.obtenido3 = '';
    this.obtenido4 = '';
    this.obtenido5 = '';
    this.obtenido6 = '';
    this.obtenido7 = '';
    this.obtenido8 = '';
    this.obtenido9 = '';
    // Trae la categoria actual
    this.categoriasService.getCategorias().subscribe(data => {
      this.categoria = data.categoria;
      this.generarForm(this.categoria);
    });

    this._utilService.loading = true;
  }


  ngOnInit(): void {
    // obtiene los proyectos calificados
    this.dashboardService.getProyectosCalificados().subscribe(
      (data: any) => this.proyectosCalificados = data.proyectos_calificados,
      err => console.log(err));
    // obtiene los proyectos por calificar
    this.dashboardService.getProyectosPorCalificar().subscribe(
      (data: any) => this.proyectosPorCalificar = data.proyectos_por_calificar,
      err => console.log(err)).add(() => {
        this._utilService.loading = false;
      });
  }
  traerProyecto(idProyecto: string) {
    this._utilService.loading = true;
    this.proyectosService.obtenerProyecto(idProyecto).subscribe(
      data => {
        this.proyectoActual = data;
        if (this.proyectoActual.status === '1') {
          this.calificarProyectoService.getCalificaciones(
            this.categoria, Number(this.proyectoActual.id_proyectos)
          ).subscribe(calificaciones => {
            console.log(calificaciones);
            switch (this.categoria) {
              case 'petit':
                this.obtenido1 = calificaciones[0].obtenido1;
                this.obtenido2 = calificaciones[0].obtenido2;
                this.obtenido3 = calificaciones[0].obtenido3;
                break;
              case 'kids':
                this.obtenido1 = calificaciones[0].obtenido1;
                this.obtenido2 = calificaciones[0].obtenido2;
                this.obtenido3 = calificaciones[0].obtenido3;
                break;
              case 'juvenil':
                this.obtenido1 = calificaciones[0].obtenido1;
                this.obtenido2 = calificaciones[0].obtenido2;
                this.obtenido3 = calificaciones[0].obtenido3;
                this.obtenido4 = calificaciones[0].obtenido4;
                this.obtenido5 = calificaciones[0].obtenido5;
                this.obtenido6 = calificaciones[0].obtenido6;
                break;
              case 'media-superior':
                this.obtenido1 = calificaciones[0].obtenido1;
                this.obtenido2 = calificaciones[0].obtenido2;
                this.obtenido3 = calificaciones[0].obtenido3;
                this.obtenido4 = calificaciones[0].obtenido4;
                this.obtenido5 = calificaciones[0].obtenido5;
                this.obtenido6 = calificaciones[0].obtenido6;
                this.obtenido7 = calificaciones[0].obtenido7;
                break;
              case 'superior':
                this.obtenido1 = calificaciones[0].obtenido1;
                this.obtenido2 = calificaciones[0].obtenido2;
                this.obtenido3 = calificaciones[0].obtenido3;
                this.obtenido4 = calificaciones[0].obtenido4;
                this.obtenido5 = calificaciones[0].obtenido5;
                this.obtenido6 = calificaciones[0].obtenido6;
                this.obtenido7 = calificaciones[0].obtenido7;
                this.obtenido8 = calificaciones[0].obtenido8;
                break;
              case '´posgrado':
                this.obtenido1 = calificaciones[0].obtenido1;
                this.obtenido2 = calificaciones[0].obtenido2;
                this.obtenido3 = calificaciones[0].obtenido3;
                this.obtenido4 = calificaciones[0].obtenido4;
                this.obtenido5 = calificaciones[0].obtenido5;
                this.obtenido6 = calificaciones[0].obtenido6;
                this.obtenido7 = calificaciones[0].obtenido7;
                this.obtenido8 = calificaciones[0].obtenido8;
                this.obtenido9 = calificaciones[0].obtenido9;
                break;
            }
          });
        } else {
          this.obtenido1 = '';
          this.obtenido2 = '';
          this.obtenido3 = '';
          this.obtenido4 = '';
          this.obtenido5 = '';
          this.obtenido6 = '';
          this.obtenido7 = '';
          this.obtenido8 = '';
          this.obtenido9 = '';
        }
      },
      err => console.log(err)
    ).add(() => {
      this._utilService.loading = false;
    });
  }
  guardarPuntos() {
    console.log(this.formPuntos.value);
    this.valores = this.formPuntos.value;
    switch (this.categoria) {
      case 'petit':
        if (this.proyectoActual.status === '1') {
          this.calificarProyectoService.putCalificacionesPetit(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3']).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesPetit(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3']).subscribe(
              data => console.log(data),
              err => console.log(err));
          this.proyectosService.actualizarEstado(this.proyectoActual.id_proyectos);
          this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias);
        }
        break;
      case 'kids':
        if (this.proyectoActual.status === '1') {
          this.calificarProyectoService.putCalificacionesKids(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3']).subscribe(
              data => console.log(data),
              err => console.log(err));

        } else {
          this.calificarProyectoService.setCalificacionesKids(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3']).subscribe(
              data => console.log(data),
              err => console.log(err));
          this.proyectosService.actualizarEstado(this.proyectoActual.id_proyectos).subscribe( data => console.log(data));
          this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
          .subscribe( data => console.log(data));
        }
        break;
      case 'juvenil':
        if (this.proyectoActual.status === '1') {
          this.calificarProyectoService.putCalificacionesJvenil(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6']).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesJvenil(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6']).subscribe(
              data => console.log(data),
              err => console.log(err));
          this.proyectosService.actualizarEstado(this.proyectoActual.id_proyectos).subscribe( data => console.log(data));
          this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
          .subscribe( data => console.log(data));
        }
        break;
      case 'media-superior':
        if (this.proyectoActual.status === '1') {
          this.calificarProyectoService.putCalificacionesMediaSuperior(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6'],
            this.valores['obtenido7']).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesMediaSuperior(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6'],
            this.valores['obtenido7']).subscribe(
              data => console.log(data),
              err => console.log(err));
          this.proyectosService.actualizarEstado(this.proyectoActual.id_proyectos).subscribe( data => console.log(data));
          this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
          .subscribe( data => console.log(data));
        }
        break;
      case 'superior':
        if (this.proyectoActual.status === '1') {
          this.calificarProyectoService.putCalificacionesSuperior(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6'],
            this.valores['obtenido7'],
            this.valores['obtenido8']).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesSuperior(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6'],
            this.valores['obtenido7'],
            this.valores['obtenido8']).subscribe(
              data => console.log(data),
              err => console.log(err));
          this.proyectosService.actualizarEstado(this.proyectoActual.id_proyectos).subscribe( data => console.log(data));
          this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
          .subscribe( data => console.log(data));
        }
        break;
      case 'posgrado':
        if (this.proyectoActual.status === '1') {
          this.calificarProyectoService.putCalificacionesPosgrado(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6'],
            this.valores['obtenido7'],
            this.valores['obtenido8'],
            this.valores['obtenido9']).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesPosgrado(
            Number(this.proyectoActual.id_proyectos),
            this.valores['obtenido1'],
            this.valores['obtenido2'],
            this.valores['obtenido3'],
            this.valores['obtenido4'],
            this.valores['obtenido5'],
            this.valores['obtenido6'],
            this.valores['obtenido7'],
            this.valores['obtenido8'],
            this.valores['obtenido9']).subscribe(
              data => console.log(data),
              err => console.log(err));
          this.proyectosService.actualizarEstado(this.proyectoActual.id_proyectos).subscribe( data => console.log(data));
          this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
          .subscribe( data => console.log(data));
        }
        break;
    }
  }
  generarForm(categoria: string) {
    console.log(categoria);
    switch (categoria) {
      case 'petit':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(50)]],
          obtenido2: ['', [Validators.required, Validators.max(30)]],
          obtenido3: ['', [Validators.required, Validators.max(20)]],
        });
        break;
      case 'kids':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(50)]],
          obtenido2: ['', [Validators.required, Validators.max(30)]],
          obtenido3: ['', [Validators.required, Validators.max(20)]],
        });
        break;
      case 'juvenil':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(30)]],
          obtenido2: ['', [Validators.required, Validators.max(20)]],
          obtenido3: ['', [Validators.required, Validators.max(10)]],
          obtenido4: ['', [Validators.required, Validators.max(10)]],
          obtenido5: ['', [Validators.required, Validators.max(15)]],
          obtenido6: ['', [Validators.required, Validators.max(15)]],
        });
        break;
      case 'media-superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(20)]],
          obtenido2: ['', [Validators.required, Validators.max(15)]],
          obtenido3: ['', [Validators.required, Validators.max(10)]],
          obtenido4: ['', [Validators.required, Validators.max(10)]],
          obtenido5: ['', [Validators.required, Validators.max(20)]],
          obtenido6: ['', [Validators.required, Validators.max(15)]],
          obtenido7: ['', [Validators.required, Validators.max(10)]],
        });
        break;
      case 'superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(20)]],
          obtenido2: ['', [Validators.required, Validators.max(10)]],
          obtenido3: ['', [Validators.required, Validators.max(10)]],
          obtenido4: ['', [Validators.required, Validators.max(10)]],
          obtenido5: ['', [Validators.required, Validators.max(10)]],
          obtenido6: ['', [Validators.required, Validators.max(20)]],
          obtenido7: ['', [Validators.required, Validators.max(10)]],
          obtenido8: ['', [Validators.required, Validators.max(10)]],
        });
        break;
      case 'posgrado':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(20)]],
          obtenido2: ['', [Validators.required, Validators.max(10)]],
          obtenido3: ['', [Validators.required, Validators.max(10)]],
          obtenido4: ['', [Validators.required, Validators.max(10)]],
          obtenido5: ['', [Validators.required, Validators.max(10)]],
          obtenido6: ['', [Validators.required, Validators.max(15)]],
          obtenido7: ['', [Validators.required, Validators.max(10)]],
          obtenido8: ['', [Validators.required, Validators.max(5)]],
          obtenido9: ['', [Validators.required, Validators.max(10)]],
        });
        break;
    }
  }

}
