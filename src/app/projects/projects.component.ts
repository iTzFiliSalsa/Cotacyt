import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ProyectosCalificados, ProyectosPorCalificar } from '../models/dashboard.model';
import { CategoriasService } from '../services/categorias.service';
import { ProyectosService } from '../services/proyectos.service';
import { Proyectos } from '../models/proyectos.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalificarProyectoService } from '../services/calificar-proyecto.service';
import { UtilsService } from '../services/utils.service';
import { Util } from '../utils/utils';
import { ProjectRegistered } from '../models/project-regis.model';
import { ProjectsRegisteredService } from '../services/project-registered.service';
import { Session } from 'src/app/models/session.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { InformacionDeLosProyectos } from '../models/proyectos.model';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  @ViewChild('swalid1') private swalInformacion: SwalComponent;
  @ViewChild('swalid2') private swalReproductor: SwalComponent;

  public isCollapsed = true;
  public allProjects: Array<ProjectRegistered>;

  informacionDeLosProyectos: InformacionDeLosProyectos[];


  categoria: string;
  video: string;
  proyectosCalificados: ProyectosCalificados[];
  proyectosPorCalificar: ProyectosPorCalificar[];
  util: Util = new Util;
  proyectoActual: Proyectos;
  formPuntos: FormGroup;
  valores: any;
  obtenido1: number;
  obtenido2: number;
  obtenido3: number;
  obtenido4: number;
  obtenido5: number;
  obtenido6: number;
  obtenido7: number;
  obtenido8: number;
  sessionData: Session;
  constructor(
    private dashboardService: DashboardService,
    private categoriasService: CategoriasService,
    private proyectosService: ProyectosService,
    private formBuilder: FormBuilder,
    private calificarProyectoService: CalificarProyectoService,
    private _utilService: UtilsService,
    private projectsService: ProjectsRegisteredService,
    private infoProject: ProyectosService,
    private _utilsService: UtilsService,
  ) {
    this.proyectosCalificados = new Array<ProyectosCalificados>();
    this.proyectosPorCalificar = new Array<ProyectosPorCalificar>();
    this.obtenido1 = 0;
    this.obtenido2 = 0;
    this.obtenido3 = 0;
    this.obtenido4 = 0;
    this.obtenido5 = 0;
    this.obtenido6 = 0;
    this.obtenido7 = 0;
    this.obtenido8 = 0;
    this.allProjects = new Array<ProjectRegistered>();
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    // Trae la categoria actual
    this.categoriasService.getCategorias().subscribe(data => {
      this.categoria = data.categoria;
      this.generarForm(this.categoria);
    });

    this._utilService.loading = true;
  }


  ngOnInit(): void {
      forkJoin({
        proyectosCalificados: this.dashboardService.getProyectosCalificados(),
        proyectosPorCalificar: this.dashboardService.getProyectosPorCalificar(),
        todosLosProyectos: this.proyectosService.obtenerTodosLosProyectosDeCategoria()
      }).subscribe(
        (data: any) => {
          this.proyectosCalificados = data.proyectosCalificados;
          this.proyectosPorCalificar = data.proyectosPorCalificar;
          console.log(data.todosLosProyectos);
          this.allProjects = data.todosLosProyectos;
        },
        err => {
          console.log(err);
        }
      ).add(() => {
        this._utilService._loading = false;
      });
  }
  abrirReproductor(evento: any, id) {
    this.video = 'http://plataforma.cotacyt.gob.mx/creatividad/' + id;
    this.swalReproductor.fire();
  }

  pdf(event) {
    window.open('http://plataforma.cotacyt.gob.mx/creatividad/' + event, '_blank');
  }

  traerProyecto(idProyecto: string) {
    this.isCollapsed = true;
    this._utilService.loading = true;
    this.proyectosService.obtenerProyecto(idProyecto).subscribe(
      data => {
        console.log(data);
        this.proyectoActual = data;
        this.proyectosService.getStatusProyecto(this.proyectoActual.id_proyectos)
          .subscribe((res) => {
            if (res[0].status === '1') {
              this.calificarProyectoService.getCalificaciones(
                this.categoria, Number(this.proyectoActual.id_proyectos)
              ).subscribe(calificaciones => {
                switch (this.categoria) {
                  case 'petit':
                    this.formPuntos.patchValue({
                      obtenido1: Number(calificaciones[0].obtenido1),
                      obtenido2: Number(calificaciones[0].obtenido2),
                      obtenido3: Number(calificaciones[0].obtenido3),
                      obtenido4: Number(calificaciones[0].obtenido4),
                      obtenido5: Number(calificaciones[0].obtenido5),
                    });
                    this.obtenido1 = Number(calificaciones[0].obtenido1);
                    this.obtenido2 = Number(calificaciones[0].obtenido2);
                    this.obtenido3 = Number(calificaciones[0].obtenido3);
                    this.obtenido4 = Number(calificaciones[0].obtenido4);
                    this.obtenido5 = Number(calificaciones[0].obtenido5);
                    break;
                  case 'kids':
                    this.formPuntos.patchValue({
                      obtenido1: Number(calificaciones[0].obtenido1),
                      obtenido2: Number(calificaciones[0].obtenido2),
                      obtenido3: Number(calificaciones[0].obtenido3),
                      obtenido4: Number(calificaciones[0].obtenido4),
                      obtenido5: Number(calificaciones[0].obtenido5),
                    });
                    this.obtenido1 = Number(calificaciones[0].obtenido1);
                    this.obtenido2 = Number(calificaciones[0].obtenido2);
                    this.obtenido3 = Number(calificaciones[0].obtenido3);
                    this.obtenido4 = Number(calificaciones[0].obtenido4);
                    this.obtenido5 = Number(calificaciones[0].obtenido5);
                    break;
                  case 'juvenil':
                    this.formPuntos.patchValue({
                      obtenido1: Number(calificaciones[0].obtenido1),
                      obtenido2: Number(calificaciones[0].obtenido2),
                      obtenido3: Number(calificaciones[0].obtenido3),
                      obtenido4: Number(calificaciones[0].obtenido4),
                      obtenido5: Number(calificaciones[0].obtenido5),
                      obtenido6: Number(calificaciones[0].obtenido6),
                    });
                    this.obtenido1 = Number(calificaciones[0].obtenido1);
                    this.obtenido2 = Number(calificaciones[0].obtenido2);
                    this.obtenido3 = Number(calificaciones[0].obtenido3);
                    this.obtenido4 = Number(calificaciones[0].obtenido4);
                    this.obtenido5 = Number(calificaciones[0].obtenido5);
                    this.obtenido6 = Number(calificaciones[0].obtenido6);
                    break;
                  case 'media superior':
                    this.formPuntos.patchValue({
                      obtenido1: Number(calificaciones[0].obtenido1),
                      obtenido2: Number(calificaciones[0].obtenido2),
                      obtenido3: Number(calificaciones[0].obtenido3),
                      obtenido4: Number(calificaciones[0].obtenido4),
                      obtenido5: Number(calificaciones[0].obtenido5),
                      obtenido6: Number(calificaciones[0].obtenido6),
                      obtenido7: Number(calificaciones[0].obtenido7),
                      obtenido8: Number(calificaciones[0].obtenido8),
                    });
                    this.obtenido1 = Number(calificaciones[0].obtenido1);
                    this.obtenido2 = Number(calificaciones[0].obtenido2);
                    this.obtenido3 = Number(calificaciones[0].obtenido3);
                    this.obtenido4 = Number(calificaciones[0].obtenido4);
                    this.obtenido5 = Number(calificaciones[0].obtenido5);
                    this.obtenido6 = Number(calificaciones[0].obtenido6);
                    this.obtenido7 = Number(calificaciones[0].obtenido7);
                    this.obtenido8 = Number(calificaciones[0].obtenido8);
                    break;
                  case 'superior':
                    this.formPuntos.patchValue({
                      obtenido1: Number(calificaciones[0].obtenido1),
                      obtenido2: Number(calificaciones[0].obtenido2),
                      obtenido3: Number(calificaciones[0].obtenido3),
                      obtenido4: Number(calificaciones[0].obtenido4),
                      obtenido5: Number(calificaciones[0].obtenido5),
                      obtenido6: Number(calificaciones[0].obtenido6),
                      obtenido7: Number(calificaciones[0].obtenido7),
                      obtenido8: Number(calificaciones[0].obtenido8),
                    });
                    this.obtenido1 = Number(calificaciones[0].obtenido1);
                    this.obtenido2 = Number(calificaciones[0].obtenido2);
                    this.obtenido3 = Number(calificaciones[0].obtenido3);
                    this.obtenido4 = Number(calificaciones[0].obtenido4);
                    this.obtenido5 = Number(calificaciones[0].obtenido5);
                    this.obtenido6 = Number(calificaciones[0].obtenido6);
                    this.obtenido7 = Number(calificaciones[0].obtenido7);
                    this.obtenido8 = Number(calificaciones[0].obtenido8);
                    break;
                  case 'posgrado':
                    this.formPuntos.patchValue({
                      obtenido1: Number(calificaciones[0].obtenido1),
                      obtenido2: Number(calificaciones[0].obtenido2),
                      obtenido3: Number(calificaciones[0].obtenido3),
                      obtenido4: Number(calificaciones[0].obtenido4),
                      obtenido5: Number(calificaciones[0].obtenido5),
                      obtenido6: Number(calificaciones[0].obtenido6),
                      obtenido7: Number(calificaciones[0].obtenido7),
                      obtenido8: Number(calificaciones[0].obtenido8),
                    });
                    this.obtenido1 = Number(calificaciones[0].obtenido1);
                    this.obtenido2 = Number(calificaciones[0].obtenido2);
                    this.obtenido3 = Number(calificaciones[0].obtenido3);
                    this.obtenido4 = Number(calificaciones[0].obtenido4);
                    this.obtenido5 = Number(calificaciones[0].obtenido5);
                    this.obtenido6 = Number(calificaciones[0].obtenido6);
                    this.obtenido7 = Number(calificaciones[0].obtenido7);
                    this.obtenido8 = Number(calificaciones[0].obtenido8);
                    break;
                }
              }, err => console.log(err));
            } else {
              this.obtenido1 = 0;
              this.obtenido2 = 0;
              this.obtenido3 = 0;
              this.obtenido4 = 0;
              this.obtenido5 = 0;
              this.obtenido6 = 0;
              this.obtenido7 = 0;
              this.obtenido8 = 0;
            }
          });
      },
      err => console.log(err)
    ).add(() => {
      this._utilService.loading = false;
    });
  }
  guardarPuntos() {
    this.valores = this.formPuntos.value;
    this._utilService.loading = true;
    console.log(this.categoria);
    this.proyectosService.getStatusProyecto(this.proyectoActual.id_proyectos)
      .subscribe((res) => {
        switch (this.categoria) {
          case 'petit':
            if (res[0].status === '1') {
              this.calificarProyectoService.putCalificacionesPetit(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                data => {
                  Swal.fire({
                    title: 'El proyecto se califico',
                    icon: 'success'
                  });
                },
                err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
              this.proyectoActual = null;
            } else {
              this.calificarProyectoService.setCalificacionesPetit(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                data => {
                  Swal.fire({
                    title: 'El proyecto se califico',
                    icon: 'success'
                  });
                },
                err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
                .subscribe(data => {
                  console.log(data);
                }, err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
              this.proyectoActual = null;
            }
            break;
          case 'kids':
            if (res[0].status === '1') {
              this.calificarProyectoService.putCalificacionesKids(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                data => {
                  Swal.fire({
                    title: 'El proyecto se califico',
                    icon: 'success'
                  });
                },
                err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
            } else {
              this.calificarProyectoService.setCalificacionesKids(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                data => {
                  Swal.fire({
                    title: 'El proyecto se califico',
                    icon: 'success'
                  });
                },
                err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
                .subscribe(data => {
                  console.log(data);
                }, err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
            }
            break;
          case 'juvenil':
            if (res[0].status === '1') {
              this.calificarProyectoService.putCalificacionesJvenil(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
                this.valores.obtenido6)
                .subscribe(
                  data => {
                    Swal.fire({
                      title: 'El proyecto se califico',
                      icon: 'success'
                    });
                  },
                  err => {
                    console.log(err);
                    Swal.fire({
                      title: 'Ocurrio un error',
                      icon: 'error'
                    });
                  });
              this._utilService.loading = false;
              this.ngOnInit();
            } else {
              this.calificarProyectoService.setCalificacionesJvenil(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
                this.valores.obtenido6).subscribe(
                  data => {
                    Swal.fire({
                      title: 'El proyecto se califico',
                      icon: 'success'
                    });
                  },
                  err => {
                    console.log(err);
                    Swal.fire({
                      title: 'Ocurrio un error',
                      icon: 'error'
                    });
                  });
              this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
                .subscribe(data => {
                  console.log(data);
                }, err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
            }
            break;
          case 'media superior':
            if (res[0].status === '1') {
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
                data => {
                  Swal.fire({
                    title: 'El proyecto se califico',
                    icon: 'success'
                  });
                },
                err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
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
                data => {
                  Swal.fire({
                    title: 'El proyecto se califico',
                    icon: 'success'
                  });
                },
                err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
                .subscribe(data => {
                  console.log(data);
                }, err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
            }
            break;
          case 'superior':
            if (res[0].status === '1') {
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
                  data => {
                    Swal.fire({
                      title: 'El proyecto se califico',
                      icon: 'success'
                    });
                  },
                  err => {
                    console.log(err);
                    Swal.fire({
                      title: 'Ocurrio un error',
                      icon: 'error'
                    });
                  });
              this._utilService.loading = false;
              this.ngOnInit();
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
                  data => {
                    Swal.fire({
                      title: 'El proyecto se califico',
                      icon: 'success'
                    });
                  },
                  err => {
                    console.log(err);
                    Swal.fire({
                      title: 'Ocurrio un error',
                      icon: 'error'
                    });
                  });
              this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
                .subscribe(data => {
                  console.log(data);
                }, err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
            }
            break;
          case 'posgrado':
            if (res[0].status === '1') {
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
                  data => {
                    Swal.fire({
                      title: 'El proyecto se califico',
                      icon: 'success'
                    });
                  },
                  err => {
                    console.log(err);
                    Swal.fire({
                      title: 'Ocurrio un error',
                      icon: 'error'
                    });
                  });
              this._utilService.loading = false;
              this.ngOnInit();
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
                  data => {
                    Swal.fire({
                      title: 'El proyecto se califico',
                      icon: 'success'
                    });
                  },
                  err => {
                    console.log(err);
                    Swal.fire({
                      title: 'Ocurrio un error',
                      icon: 'error'
                    });
                  });
              this.proyectosService.setProyectoCalificado(this.proyectoActual.id_proyectos, this.proyectoActual.id_categorias)
                .subscribe(data => {
                  console.log(data);
                }, err => {
                  console.log(err);
                  Swal.fire({
                    title: 'Ocurrio un error',
                    icon: 'error'
                  });
                });
              this._utilService.loading = false;
              this.ngOnInit();
            }
            break;
        }
        this.generarForm(this.categoria);
        this.isCollapsed = !this.isCollapsed;
        this.proyectoActual = null;
      });
  }
  generarForm(categoria: string) {
    const expReg = RegExp('^[0-9]+$');
    switch (categoria) {
      case 'petit':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(40), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'kids':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(40), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'juvenil':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'media superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido7: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido8: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido7: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido8: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'posgrado':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(15), Validators.min(0), Validators.pattern(expReg)]],
          obtenido7: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido8: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
    }
  }




  //mostrar informacion de proyecto seleccionado - Todos los proyectos
  mostrarInfoTodosLosProyectos(proyecto: ProjectRegistered) {
    if ( this.sessionData.rol === 'admin') {
      this.infoProject.obtenerInformacionDeUnProyectoAdmin(proyecto.id_proyectos).subscribe(
        data => {
          this.informacionDeLosProyectos = data;
        },
        err => console.log(err)
        ).add(() => {
          this._utilsService._loading = false;
        });
      } else {
        this.infoProject.obtenerInformacionDeUnProyecto(proyecto.id_proyectos).subscribe(
          data => {
            console.log(data);
            this.informacionDeLosProyectos = data;
          },
          err => console.log(err)
          ).add(() => {
            this._utilsService._loading = false;
          });
        }
    this.swalInformacion.fire();
  }


  //mostrar informacion de proyecto seleccionado - Proyectos calificados
  mostrarInfoCalificados(proyecto: ProyectosCalificados) {
    if(this.sessionData.rol === 'admin') {
      this.infoProject.obtenerInformacionDeUnProyectoAdmin(proyecto.id_proyectos).subscribe(
        data => {
          this.informacionDeLosProyectos = data;
        },
        err => console.log(err)
      ).add(() => {
        this._utilsService._loading = false;
      });
    } else {
      this.infoProject.obtenerInformacionDeUnProyecto(proyecto.id_proyectos).subscribe(
        data => {
          this.informacionDeLosProyectos = data;
        },
        err => console.log(err)
      ).add(() => {
        this._utilsService._loading = false;
      });
    }
    this.swalInformacion.fire();
  }


  //mostrar informacion de proyecto seleccionado - Proyectos por calificar
  mostrarInfoPorCalificar(proyecto: ProyectosCalificados) {
    if(this.sessionData.rol === 'admin' ) {
      this.infoProject.obtenerInformacionDeUnProyectoAdmin(proyecto.id_proyectos).subscribe(
        data => {
          this.informacionDeLosProyectos = data;
        },
        err => console.log(err)
        ).add(() => {
          this._utilsService._loading = false;
        });
    } else {
      this.infoProject.obtenerInformacionDeUnProyecto(proyecto.id_proyectos).subscribe(
        data => {
          this.informacionDeLosProyectos = data;
        },
        err => console.log(err)
        ).add(() => {
          this._utilsService._loading = false;
        });
    }
    this.swalInformacion.fire();
    }

}
