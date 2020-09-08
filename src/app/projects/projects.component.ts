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
import { Util } from '../utils/utils';
import { ProjectsRegistered } from '../models/project-regis.model';
import { ProjectsRegisteredService } from '../services/project-registered.service';
import { Session } from 'src/app/models/session.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  public isCollapsed = true;
  public allProjects: Array<ProjectsRegistered>;
  

  categoria: string;
  proyectosCalificados: ProyectosCalificados[];
  proyectosPorCalificar: ProyectosPorCalificar[];
  util: Util = new Util;
  proyectoActual: Proyectos;
  formPuntos: FormGroup;
  valores: any;
  obtenido1: string;
  obtenido2: string;
  obtenido3: string;
  obtenido4: string;
  obtenido5: string;
  obtenido6: string;
  obtenido7: string;
  obtenido8: string;
  sessionData: Session;
  constructor(private dashboardService: DashboardService,
              private categoriasService: CategoriasService,
              private proyectosService: ProyectosService,
              private formBuilder: FormBuilder,
              private calificarProyectoService: CalificarProyectoService,
              private _utilService: UtilsService,
              private projectsService: ProjectsRegisteredService
              ) {
    this.proyectosCalificados = new Array<ProyectosCalificados>();
    this.proyectosPorCalificar = new Array<ProyectosPorCalificar>();
    this.obtenido1 = '';
    this.obtenido2 = '';
    this.obtenido3 = '';
    this.obtenido4 = '';
    this.obtenido5 = '';
    this.obtenido6 = '';
    this.obtenido7 = '';
    this.obtenido8 = '';
    this.allProjects = new Array<ProjectsRegistered>();
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    // Trae la categoria actual
    this.categoriasService.getCategorias().subscribe(data => {
      this.categoria = data.categoria;
      this.generarForm(this.categoria);
    });

    this._utilService.loading = true;
  }


  ngOnInit(): void {

    //TODOS LOS PROYECTOS, ESTO SE CAMBIARA POR CATEGORIAS
    
    if(this.sessionData.usuario === 'admin'){
      this.projectsService.getProjects().subscribe(
        res => {
          this.allProjects = res;
          this.adminProjects(this.allProjects);
          console.log(res);
        },
        err => {
          console.log(<any>err);
        }
      ).add(()=> {
        this._utilService.loading = false;
      });
    }else{
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

  }

  adminProjects(proyectos){
    proyectos.filter((res) => {
      if(res.status === '1'){
        this.proyectosCalificados.push(res);
      }else{
        this.proyectosPorCalificar.push(res);
      }
    });
  }

  traerProyecto(idProyecto: string) {
    this.isCollapsed = true;
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
                this.obtenido4 = calificaciones[0].obtenido4;
                this.obtenido5 = calificaciones[0].obtenido5;
                break;
              case 'kids':
                this.obtenido1 = calificaciones[0].obtenido1;
                this.obtenido2 = calificaciones[0].obtenido2;
                this.obtenido3 = calificaciones[0].obtenido3;
                this.obtenido4 = calificaciones[0].obtenido4;
                this.obtenido5 = calificaciones[0].obtenido5;
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
                this.obtenido8 = calificaciones[0].obtenido8;
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
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            ).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesPetit(
            Number(this.proyectoActual.id_proyectos),
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            ).subscribe(
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
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            ).subscribe(
              data => console.log(data),
              err => console.log(err));

        } else {
          this.calificarProyectoService.setCalificacionesKids(
            Number(this.proyectoActual.id_proyectos),
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            ).subscribe(
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
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesJvenil(
            Number(this.proyectoActual.id_proyectos),
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6).subscribe(
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
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6,
            this.valores.obtenido7,
            this.valores.obtenido8,
            ).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesMediaSuperior(
            Number(this.proyectoActual.id_proyectos),
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6,
            this.valores.obtenido7,
            this.valores.obtenido8,
            ).subscribe(
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
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6,
            this.valores.obtenido7,
            this.valores.obtenido8).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesSuperior(
            Number(this.proyectoActual.id_proyectos),
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6,
            this.valores.obtenido7,
            this.valores.obtenido8).subscribe(
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
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6,
            this.valores.obtenido7,
            this.valores.obtenido8).subscribe(
              data => console.log(data),
              err => console.log(err));
        } else {
          this.calificarProyectoService.setCalificacionesPosgrado(
            Number(this.proyectoActual.id_proyectos),
            this.valores.obtenido1,
            this.valores.obtenido2,
            this.valores.obtenido3,
            this.valores.obtenido4,
            this.valores.obtenido5,
            this.valores.obtenido6,
            this.valores.obtenido7,
            this.valores.obtenido8).subscribe(
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
          obtenido1: ['', [Validators.required, Validators.max(10)]],
          obtenido2: ['', [Validators.required, Validators.max(40)]],
          obtenido3: ['', [Validators.required, Validators.max(10)]],
          obtenido4: ['', [Validators.required, Validators.max(20)]],
          obtenido5: ['', [Validators.required, Validators.max(20)]],
        });
        break;
      case 'kids':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(10)]],
          obtenido2: ['', [Validators.required, Validators.max(40)]],
          obtenido3: ['', [Validators.required, Validators.max(10)]],
          obtenido4: ['', [Validators.required, Validators.max(20)]],
          obtenido5: ['', [Validators.required, Validators.max(20)]],
        });
        break;
      case 'juvenil':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(10)]],
          obtenido2: ['', [Validators.required, Validators.max(30)]],
          obtenido3: ['', [Validators.required, Validators.max(5)]],
          obtenido4: ['', [Validators.required, Validators.max(15)]],
          obtenido5: ['', [Validators.required, Validators.max(20)]],
          obtenido6: ['', [Validators.required, Validators.max(20)]],
        });
        break;
      case 'media-superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(10)]],
          obtenido2: ['', [Validators.required, Validators.max(30)]],
          obtenido3: ['', [Validators.required, Validators.max(5)]],
          obtenido4: ['', [Validators.required, Validators.max(15)]],
          obtenido5: ['', [Validators.required, Validators.max(15)]],
          obtenido6: ['', [Validators.required, Validators.max(15)]],
          obtenido7: ['', [Validators.required, Validators.max(5)]],
          obtenido8: ['', [Validators.required, Validators.max(5)]],
        });
        break;
      case 'superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(10)]],
          obtenido2: ['', [Validators.required, Validators.max(30)]],
          obtenido3: ['', [Validators.required, Validators.max(5)]],
          obtenido4: ['', [Validators.required, Validators.max(15)]],
          obtenido5: ['', [Validators.required, Validators.max(15)]],
          obtenido6: ['', [Validators.required, Validators.max(15)]],
          obtenido7: ['', [Validators.required, Validators.max(5)]],
          obtenido8: ['', [Validators.required, Validators.max(5)]],
        });
        break;
      case 'posgrado':
        this.formPuntos = this.formBuilder.group({
          obtenido1: ['', [Validators.required, Validators.max(10)]],
          obtenido2: ['', [Validators.required, Validators.max(30)]],
          obtenido3: ['', [Validators.required, Validators.max(5)]],
          obtenido4: ['', [Validators.required, Validators.max(15)]],
          obtenido5: ['', [Validators.required, Validators.max(15)]],
          obtenido6: ['', [Validators.required, Validators.max(15)]],
          obtenido7: ['', [Validators.required, Validators.max(5)]],
          obtenido8: ['', [Validators.required, Validators.max(5)]],
        });
        break;
    }
  }

}
