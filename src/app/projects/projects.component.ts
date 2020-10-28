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
import { JuecesService } from '../services/jueces.service';
import { jsPDF } from "jspdf";
import '../../assets/fonts/Helvetica.ttf';
import { TitleCasePipe } from '@angular/common';


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
  validacionProjectos: number;

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
    private projectsJudges: JuecesService,
    private titlecasePipe: TitleCasePipe
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
        todosLosProyectos: this.proyectosService.obtenerTodosLosProyectosDeCategoria(),
        validarProjectos: this.projectsJudges.getValidacionProyectos(this.sessionData.id_jueces),
      }).subscribe(
        (data: any) => {
          this.proyectosCalificados = data.proyectosCalificados;
          this.proyectosPorCalificar = data.proyectosPorCalificar;
          this.allProjects = data.todosLosProyectos;
          this.validacionProjectos = data.validarProjectos.termino;
          console.log(this.validacionProjectos);
          
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
        this.proyectoActual = data;
        this.proyectosService.getStatusProyecto(this.proyectoActual.id_proyectos)
          .subscribe((res) => {
            if (res[0].status === '1') {
              this.getCalificacionesProyecto(this.categoria, Number(this.proyectoActual.id_proyectos))
              .subscribe(calificaciones => {
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
  getCalificacionesProyecto(categoria: string, idProyecto: number) {
    if (this.sessionData.id_sedes === '8') {
      return this.calificarProyectoService.getCalificacionesEstatales(categoria, idProyecto);
    } else if (this.sessionData.id_sedes === '9') {
      return this.calificarProyectoService.getCalificacionesInternacionales(categoria, idProyecto);
    } else {
      return this.calificarProyectoService.getCalificaciones(categoria, idProyecto);
    }
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
              this.sessionData.id_sedes === '8'
              ? this.calificarProyectoService.putCalificacionesPetitEstatal(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                _ => {
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
                })
                : this.calificarProyectoService.putCalificacionesPetit(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                ).subscribe(
                  _ => {
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
              this.sessionData.id_sedes === '8'
              ? this.calificarProyectoService.setCalificacionesPetitEstatal(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                _ => {
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
                })
                : this.calificarProyectoService.setCalificacionesPetit(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                ).subscribe(
                  _ => {
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
              this.sessionData.id_sedes === '8'
              ? this.calificarProyectoService.putCalificacionesKidsEstatal(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                _ => {
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
                })
                : this.calificarProyectoService.putCalificacionesKids(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                ).subscribe(
                  _ => {
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
              this.sessionData.id_sedes === '8'
              ? this.calificarProyectoService.setCalificacionesKidsEstatal(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
              ).subscribe(
                _ => {
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
                })
                : this.calificarProyectoService.setCalificacionesKids(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                ).subscribe(
                  _ => {
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
              this.sessionData.id_sedes === '8'
              ? this.calificarProyectoService.putCalificacionesJvenilEstatal(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
                this.valores.obtenido6)
                .subscribe(
                  _ => {
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
                  })
                  : this.calificarProyectoService.putCalificacionesJvenil(
                    Number(this.proyectoActual.id_proyectos),
                    this.valores.obtenido1,
                    this.valores.obtenido2,
                    this.valores.obtenido3,
                    this.valores.obtenido4,
                    this.valores.obtenido5,
                    this.valores.obtenido6)
                    .subscribe(
                      _ => {
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
              if (this.sessionData.id_sedes === '8') {
                this.calificarProyectoService.putCalificacionesMediaSuperiorEstatal(
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
                  _ => {
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
              } else if (this.sessionData.id_sedes === '9') {
                this.calificarProyectoService.putCalificacionesMediaSuperiorInternacional(
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
                  _ => {
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
              } else {
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
                  _ => {
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
              }
              this._utilService.loading = false;
              this.ngOnInit();
            } else {
              if (this.sessionData.id_sedes === '8') {
                this.calificarProyectoService.setCalificacionesMediaSuperiorEstatal(
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
                  _ => {
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
              } else if (this.sessionData.id_sedes === '9') {
                this.calificarProyectoService.setCalificacionesMediaSuperiorInternacional(
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
                  _ => {
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
                  _ => {
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
              }
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
              if (this.sessionData.id_sedes === '8') {
                this.calificarProyectoService.putCalificacionesSuperiorEstatal(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                  this.valores.obtenido6,
                  this.valores.obtenido7,
                  this.valores.obtenido8).subscribe(
                    _ => {
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
              } else if (this.sessionData.id_sedes === '9') {
                this.calificarProyectoService.putCalificacionesSuperiorInternacional(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                  this.valores.obtenido6,
                  this.valores.obtenido7,
                  this.valores.obtenido8).subscribe(
                    _ => {
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
              } else {
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
                    _ => {
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
              }
              this._utilService.loading = false;
              this.ngOnInit();
            } else {
              if (this.sessionData.id_sedes === '8') {
                this.calificarProyectoService.setCalificacionesSuperiorEstatal(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                  this.valores.obtenido6,
                  this.valores.obtenido7,
                  this.valores.obtenido8).subscribe(
                    _ => {
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
              } else if (this.sessionData.id_sedes === '9') {
                this.calificarProyectoService.setCalificacionesSuperiorInternacional(
                  Number(this.proyectoActual.id_proyectos),
                  this.valores.obtenido1,
                  this.valores.obtenido2,
                  this.valores.obtenido3,
                  this.valores.obtenido4,
                  this.valores.obtenido5,
                  this.valores.obtenido6,
                  this.valores.obtenido7,
                  this.valores.obtenido8).subscribe(
                    _ => {
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
                    _ => {
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
              }
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
              this.sessionData.id_sedes === '8'
              ? this.calificarProyectoService.putCalificacionesPosgradoEstatal(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
                this.valores.obtenido6,
                this.valores.obtenido7,
                this.valores.obtenido8).subscribe(
                  _ => {
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
                  })
                  : this.calificarProyectoService.putCalificacionesPosgrado(
                    Number(this.proyectoActual.id_proyectos),
                    this.valores.obtenido1,
                    this.valores.obtenido2,
                    this.valores.obtenido3,
                    this.valores.obtenido4,
                    this.valores.obtenido5,
                    this.valores.obtenido6,
                    this.valores.obtenido7,
                    this.valores.obtenido8).subscribe(
                      _ => {
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
              this.sessionData.id_sedes === '8'
              ? this.calificarProyectoService.setCalificacionesPosgradoEstatal(
                Number(this.proyectoActual.id_proyectos),
                this.valores.obtenido1,
                this.valores.obtenido2,
                this.valores.obtenido3,
                this.valores.obtenido4,
                this.valores.obtenido5,
                this.valores.obtenido6,
                this.valores.obtenido7,
                this.valores.obtenido8).subscribe(
                  _ => {
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
                  })
                  : this.calificarProyectoService.setCalificacionesPosgrado(
                    Number(this.proyectoActual.id_proyectos),
                    this.valores.obtenido1,
                    this.valores.obtenido2,
                    this.valores.obtenido3,
                    this.valores.obtenido4,
                    this.valores.obtenido5,
                    this.valores.obtenido6,
                    this.valores.obtenido7,
                    this.valores.obtenido8).subscribe(
                      _ => {
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
        this.ngOnInit();
      });
  }
  generarForm(categoria: string) {
    const expReg = RegExp('^[0-9]+$');
    switch (categoria) {
      case 'petit':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(40), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'kids':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(40), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'juvenil':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(20), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(40), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'media superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(25), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido7: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido8: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'superior':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(25), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(35), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido7: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido8: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
      case 'posgrado':
        this.formPuntos = this.formBuilder.group({
          obtenido1: [0, [Validators.required, Validators.max(25), Validators.min(0), Validators.pattern(expReg)]],
          obtenido2: [0, [Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(expReg)]],
          obtenido3: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido4: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido5: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido6: [0, [Validators.required, Validators.max(10), Validators.min(0), Validators.pattern(expReg)]],
          obtenido7: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
          obtenido8: [0, [Validators.required, Validators.max(5), Validators.min(0), Validators.pattern(expReg)]],
        });
        break;
    }
  }




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
            this.informacionDeLosProyectos = data;
          },
          err => console.log(err)
          ).add(() => {
            this._utilsService._loading = false;
          });
        }
    this.swalInformacion.fire();
  }

    updateValidationProjects() {
      this.projectsJudges.updateEvaluation(this.sessionData.id_jueces).subscribe(
        data => {
          console.log(data);
          localStorage.removeItem('session');
          Swal.fire({
            title: data,
            text: 'Se cerrara la sesion',
            icon: 'success'
          }).then(() => {
            const doc = new jsPDF('p', 'in', 'letter');
            doc.addImage('assets/image/acuse.jpg', 'jpg', 0, 0, 8.5, 11).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
            doc.text(this.titlecasePipe.transform(this.sessionData.nombre), 4.2, 6.9, { align: 'center' }).setFontSize(16).setFont('Helvetica').setTextColor('#646464');
            doc.save('Acuse de recibo.pdf');
            window.location.reload();
          });
        },
        err => {
          console.log(err);
        }
      );
    }

}
