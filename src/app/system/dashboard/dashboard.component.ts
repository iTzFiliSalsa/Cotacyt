import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AreasService } from 'src/app/services/areas.service';
import { Subscriber, forkJoin } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { JsonPipe } from '@angular/common';
import { Totales, ProyectosCalificados, ProyectosPorCalificar } from '../../models/dashboard.model';
import { Session } from 'src/app/models/session.model';
import { CategoriasService } from '../../services/categorias.service';
import { CalificacionesService } from '../../services/calificaciones.service';
import { Calificaciones } from '../../models/calificaciones.model';
import { AppComponent } from 'src/app/app.component';
import { UtilsService } from 'src/app/services/utils.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { Util } from 'src/app/utils/utils';
import { ProjectsRegisteredService } from 'src/app/services/project-registered.service';
import { ProjectRegistered } from 'src/app/models/project-regis.model';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalificacionesPorCategoria } from '../../models/calificaciones.model'
import { InformacionDeLosProyectos } from '../../models/proyectos.model'
import { ProyectosService } from '../../services/proyectos.service'
import { jsPDF } from "jspdf";
import '../../../assets/fonts/Helvetica.ttf';
import '../../../assets/fonts/Caviar.ttf';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {



  @ViewChild('swalid') private swalCalificaciones: SwalComponent;
  @ViewChild('swalid1') private swalInformacion: SwalComponent;
  @ViewChild('swalid2') private swalReproductor: SwalComponent;
  @ViewChild('video') private videoTag: any;


  public video: string;
  public formsFiltro: FormGroup;
  proyectosCalificacion: any[];
  proyectos: ProjectRegistered[];
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  public barChartColors: Color[] = [
    { backgroundColor: '#97c83c' },
  ];
  public barChartLabels: Label[] = ['Petit', 'Kids', 'Juvenil', 'Media Superior', 'Superior', 'Posgrado'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[];
  public ht;
  public util: Util;

  totales: Totales[];
  categoria: string;
  proyectosCalificados: ProyectosCalificados[];
  proyectosPorCalificar: ProyectosPorCalificar[];
  estadisticasDeProyectos: Calificaciones[];

  proyectosCalificadosPorCategoria: CalificacionesPorCategoria[];
  informacionDeLosProyectos: InformacionDeLosProyectos[];

  sessionData: Session;
  asesorActual: any;
  constructor(
    private dashboardService: DashboardService,
    private categoriasService: CategoriasService,
    private calificacionesService: CalificacionesService,
    private _utilsService: UtilsService,
    private projectsService: ProjectsRegisteredService,
    public readonly swalTargets: SwalPortalTargets,
    public formBuilder: FormBuilder,
    private infoProject: ProyectosService,
    private proyectosService: ProyectosService,
  ) {

    this.proyectosCalificacion = new Array<any>();
    this.formsFiltro = formBuilder.group({
      id_categorias: ['', [Validators.required]],
    });

    this.totales = new Array<Totales>();
    this.proyectosCalificados = new Array<ProyectosCalificados>();
    this.proyectosPorCalificar = new Array<ProyectosPorCalificar>();
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.estadisticasDeProyectos = new Array<Calificaciones>();
    this._utilsService._loading = true;
    this.util = new Util;
    this.proyectos = new Array<ProjectRegistered>();
    this.proyectosCalificadosPorCategoria = new Array<CalificacionesPorCategoria>();
  }

  ngOnInit(): void {
    setInterval(() => {
      const d = new Date();
      this.ht = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }, 1000);

    this.barChartData = [
      { data: [], label: 'Proyectos' }
    ];
    if ( this.sessionData.rol === 'superuser') {
      forkJoin({
        proyectos: this.dashboardService.getProyectosSuperUser(),
        totales: this.dashboardService.getTotalesSuperUser(),
        estadisticas: this.calificacionesService.proyectosEstadisticas(),
        grafica: this.dashboardService.getProyectosPorCategorias(),
      }).subscribe (
        data => {
          this.totales = data.totales;
          this.adminProjects(data.proyectos);
          
          this.estadisticasDeProyectos = data.estadisticas;
          this.construirGrafica(data.grafica);
        }
      ).add(() => this._utilsService._loading = false);
      this.dashboardService.getTotalesSuperUser().subscribe(
        data => {
          this.totales = data;
        },
        err => console.log(err)
      );
    } else if (this.sessionData.rol === 'admin') {
      forkJoin({
        totales: this.dashboardService.getTotalesAdmin(),
        proyectos: this.projectsService.getProjects(),
        estadisticas: this.calificacionesService.proyectosEstadisticasAdmin(),
        grafica: this.dashboardService.getProyectosPorCategoriasAdmin(),
      }).subscribe(
        data => {
          this.totales = data.totales;
          this.adminProjects(data.proyectos);
          this.estadisticasDeProyectos = data.estadisticas;
          this.construirGrafica(data.grafica);
        },
        err => {
          console.log(err);
        }
      ).add(() => this._utilsService._loading = false);
    } else {
      forkJoin({
        proyectosCalificados: this.dashboardService.getProyectosCalificados(),
        totales: this.dashboardService.getTotales(),
        proyectosPorCalificar: this.dashboardService.getProyectosPorCalificar(),
        estadisticas: this.calificacionesService.proyectosEstadisticasJuez(),
        grafica: this.dashboardService.getProyectosPorCategoriasAdmin()
      }).subscribe(
        data => {
          this.proyectosCalificados = data.proyectosCalificados;
          console.log(data);
          this.proyectosPorCalificar = data.proyectosPorCalificar;
          this.estadisticasDeProyectos = data.estadisticas;
          this.construirGrafica(data.grafica);
          this.totales = data.totales;
        },
        err => {
          console.log(err);
        }
      ).add(() => this._utilsService._loading = false);
    }

    this.sessionData = JSON.parse(localStorage.getItem('session'));
    // obtiene la categoria de la sesión actual
    this.categoriasService.getCategorias().subscribe(data => {
      this.categoria = data.categoria;
    });
  }
  construirGrafica(data: any) {
    const petit = data.petit;
    const kids = data.kids;
    const juvenil = data.juvenil;
    const mediaSuperior = data['media-superior'];
    const superior = data.superior;
    const posgrado = data.posgrado;
    this.barChartData = [
      { data: [petit, kids, juvenil, mediaSuperior, superior, posgrado], label: 'Proyectos' }
    ];
  }
  adminProjects(proyectos) {
    proyectos.filter((res) => {
      this.proyectosService.getStatusAdmin(res.id_proyectos)
        .subscribe(data => {
          if (data[0].status === '1') {
            this.proyectosCalificados.push(res);
            console.log(this.proyectosCalificados);
          } else {
            this.proyectosPorCalificar.push(res);
          }
        });
    });
  }

  getPercent(porcentaje: string) {
    Number(porcentaje);
    return {
      width: porcentaje + '%'
    };
  }

  //abrir swal de calificaciones por categoria
  mostrarProyectosPorCalificacion(evt: any) {
    this.swalCalificaciones.fire();
    this.calificacionesService.listaDeCalificaciones().subscribe(
      data => {
        console.log(this.formsFiltro.value['id_categorias']);
        this.proyectosCalificadosPorCategoria = data;
        const petit = data['petit'];
        this.proyectosCalificacion = petit;
      },
      err => console.log(err)
    ).add(() => {
      this._utilsService.loading = false;
    });
  }



  //mostrar tabla de calificaciones por categorias de mayor a menor
  mostrarListaCalificaciones() {
    this.calificacionesService.listaDeCalificaciones().subscribe(
      data => {
        console.log(this.formsFiltro.value['id_categorias']);
        this.proyectosCalificadosPorCategoria = data;
        const petit = data['petit'];
        const kids = data['kids'];
        const juvenil = data['juvenil'];
        const mediaSuperior = data['media_superior'];
        const superior = data['superior'];
        const posgrado = data['posgrado'];
        const category = this.formsFiltro.value['id_categorias'];
        switch (this.formsFiltro.value['id_categorias']) {
          case 'petit':
            console.log(petit);
            this.proyectosCalificacion = petit;
            this.imprimir(this.proyectosCalificacion, category);
            console.log('holsss');
            console.log(this.proyectosCalificacion);
            
            
            console.log(this.proyectosCalificacion.sort(function (prev: any, next: any) {
              return next.total - prev.total;

            }));
            break;

          case 'kids':
            console.log(kids);
            this.proyectosCalificacion = kids;
            this.imprimir(this.proyectosCalificacion, category);
            break;

          case 'juvenil':
            console.log(juvenil);
            this.proyectosCalificacion = juvenil;
            this.imprimir(this.proyectosCalificacion, category);
            break;

          case 'media-superior':
            console.log(mediaSuperior);
            this.proyectosCalificacion = mediaSuperior;
            this.imprimir(this.proyectosCalificacion, category);
            break;

          case 'superior':
            console.log(superior);
            this.proyectosCalificacion = superior;
            this.imprimir(this.proyectosCalificacion, category);
            break;

          case 'posgrado':
            console.log(posgrado);
            this.proyectosCalificacion = posgrado;
            this.imprimir(this.proyectosCalificacion, category);

            break;
          default: this.proyectosCalificacion = petit;
            break
        }
      },
      err => console.log(err)
    ).add(() => {
      this._utilsService.loading = false;
    });
  }


  //mostrar informacion de proyecto seleccionado
  mostrarInfoCalificados(proyecto: ProyectosCalificados) {
    if (this.sessionData.rol === 'admin') {
      this.infoProject.obtenerInformacionDeUnProyectoAdmin(proyecto.id_proyectos).subscribe(
        data => {
          console.log(data);
          this.informacionDeLosProyectos = data;
          console.log(this.informacionDeLosProyectos);
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
          console.log(this.informacionDeLosProyectos);
        },
        err => console.log(err)
      ).add(() => {
        this._utilsService._loading = false;
      });
    }
    this.swalInformacion.fire();
  }


  //mostrar informacion de proyecto seleccionado
  mostrarInfoPorCalificar(proyecto: ProyectosPorCalificar) {
    if (this.sessionData.rol === 'admin') {
      this.infoProject.obtenerInformacionDeUnProyectoAdmin(proyecto.id_proyectos).subscribe(
        data => {
          console.log(data);
          this.informacionDeLosProyectos = data;
          console.log(this.informacionDeLosProyectos);
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
          console.log(this.informacionDeLosProyectos);
        },
        err => console.log(err)
      ).add(() => {
        this._utilsService._loading = false;
      });
    }
    this.swalInformacion.fire();
  }



  abrirReproductor(evento: any, id) {
    console.log(this.videoTag);
    console.log(id);
    this.video = 'http://plataforma.cotacyt.gob.mx/creatividad/'+id;
    this.swalReproductor.fire();
  }

  pdf(event){
    window.open('http://plataforma.cotacyt.gob.mx/creatividad/'+event,'_blank');
  }

  saveAsPdf(index: number, autores: string[], proyecto: any) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    if (index === 0) {
      if (!autores) {
        swal.fire({
          icon: 'error',
          title: 'No tienes autores registrados en este proyecto, agrega para descargar.'
        });
      }

      switch (this.sessionData.id_sedes) {
        case '1':
          switch (this.formsFiltro.value['id_categorias']) {
            case 'petit':
              this.firstPlace(proyecto, autores, 'mante', 'PetitMante');
              break;
            case 'kids':
              this.firstPlace(proyecto, autores, 'mante', 'KidsMante');
              break;
            case 'juvenil':
              this.firstPlace(proyecto, autores, 'mante', 'JuvenilMante');
              break;
            case 'media-superior':
              this.firstPlace(proyecto, autores, 'mante', 'MSMante');
              break;
            case 'superior':
              this.firstPlace(proyecto, autores, 'mante', 'SuperiorMante');
              break;
            case 'posgrado':
              this.firstPlace(proyecto, autores, 'mante', 'PosgradoMante');
              break;
          }

          break;
        case '2':
          switch (this.formsFiltro.value['id_categorias']) {
            case 'petit':
              this.firstPlace(proyecto, autores, 'reynosa', 'PetitReynosa');
              break;
            case 'kids':
              this.firstPlace(proyecto, autores, 'reynosa', 'KidsReynosa');
              break;
            case 'juvenil':
              this.firstPlace(proyecto, autores, 'reynosa', 'JuvenilReynosa');
              break;
            case 'media-superior':
              this.firstPlace(proyecto, autores, 'reynosa', 'MSReynosa');
              break;
            case 'superior':
              this.firstPlace(proyecto, autores, 'reynosa', 'SuperiorReynosa');
              break;
            case 'posgrado':
              this.firstPlace(proyecto, autores, 'reynosa', 'PosgradoReynosa');
              break;
          }
          break;
        case '3':
          switch (this.formsFiltro.value['id_categorias']) {
            case 'petit':
              this.firstPlace(proyecto, autores, 'matamoros', 'PetitMatamoros');
              break;
            case 'kids':
              this.firstPlace(proyecto, autores, 'matamoros', 'KidsMatamoros');
              break;
            case 'juvenil':
              this.firstPlace(proyecto, autores, 'matamoros', 'JuvenilMatamoros');
              break;
            case 'media-superior':
              this.firstPlace(proyecto, autores, 'matamoros', 'MSMatamoros');
              break;
            case 'superior':
              this.firstPlace(proyecto, autores, 'matamoros', 'SuperiorMatamoros');
              break;
            case 'posgrado':
              this.firstPlace(proyecto, autores, 'matamoros', 'PosgradoMatamoros');
              break;
          }
          break;
        case '4':
          switch (this.formsFiltro.value['id_categorias']) {
            case 'petit':
              this.firstPlace(proyecto, autores, 'madero', 'PetitMadero');
              break;
            case 'kids':
              this.firstPlace(proyecto, autores, 'madero', 'KidsMadero');
              break;
            case 'juvenil':
              this.firstPlace(proyecto, autores, 'madero', 'JuvenilMadero');
              break;
            case 'media-superior':
              this.firstPlace(proyecto, autores, 'madero', 'MSMadero');
              break;
            case 'superior':
              this.firstPlace(proyecto, autores, 'madero', 'SuperiorMadero');
              break;
            case 'posgrado':
              this.firstPlace(proyecto, autores, 'madero', 'PosgradoMadero');
              break;
          }
          break;
        case '5':
          switch (this.formsFiltro.value['id_categorias']) {
            case 'petit':
              this.firstPlace(proyecto, autores, 'jaumave', 'PetitJaumave');
              break;
            case 'kids':
              this.firstPlace(proyecto, autores, 'jaumave', 'KidsJaumave');
              break;
            case 'juvenil':
              this.firstPlace(proyecto, autores, 'jaumave', 'JuvenilJaumave');
              break;
            case 'media-superior':
              this.firstPlace(proyecto, autores, 'jaumave', 'MSJaumave');
              break;
            case 'superior':
              this.firstPlace(proyecto, autores, 'jaumave', 'SuperiorJaumave');
              break;
            case 'posgrado':
              this.firstPlace(proyecto, autores, 'jaumave', 'PosgradoJaumave');
              break;
          }
          break;
        case '6':
          switch (this.formsFiltro.value['id_categorias']) {
            case 'petit':
              this.firstPlace(proyecto, autores, 'nuevo-laredo', 'PetitNuevoLaredo');
              break;
            case 'kids':
              this.firstPlace(proyecto, autores, 'nuevo-laredo', 'KidsNuevoLaredo');
              break;
            case 'juvenil':
              this.firstPlace(proyecto, autores, 'nuevo-laredo', 'JuvenilNuevoLaredo');
              break;
            case 'media-superior':
              this.firstPlace(proyecto, autores, 'nuevo-laredo', 'MSNuevoLaredo');
              break;
            case 'superior':
              this.firstPlace(proyecto, autores, 'nuevo-laredo', 'SuperiorNuevoLaredo');
              break;
            case 'posgrado':
              this.firstPlace(proyecto, autores, 'nuevo-laredo', 'PosgradoNuevoLaredo');
              break;
          }
          break;
        case '7':
          switch (this.formsFiltro.value['id_categorias']) {
            case 'petit':
              this.firstPlace(proyecto, autores, 'victoria', 'PetitVictoria');
              break;
            case 'kids':
              this.firstPlace(proyecto, autores, 'victoria', 'KidsVictoria');
              break;
            case 'juvenil':
              this.firstPlace(proyecto, autores, 'victoria', 'JuvenilVictoria');
              break;
            case 'media-superior':
              this.firstPlace(proyecto, autores, 'victoria', 'MSVictoria');
              break;
            case 'superior':
              this.firstPlace(proyecto, autores, 'victoria', 'SuperiorVictoria');
              break;
            case 'posgrado':
              this.firstPlace(proyecto, autores, 'victoria', 'PosgradoVictoria');
              break;
          }
          break;
      }
    } else {
      if (index === 1) {
        if (!autores) {
          swal.fire({
            icon: 'error',
            title: 'No tienes autores registrados en este proyecto, agrega para descargar.'
          });
        }
        console.log(index);
        console.log(this.formsFiltro.value['id_categorias']);
        switch (this.sessionData.id_sedes) {
          case '1':
            switch (this.formsFiltro.value['id_categorias']) {
              case 'petit':
                this.secondPlace(proyecto, autores, 'mante', 'PetitMante');
                break;
              case 'kids':
                this.secondPlace(proyecto, autores, 'mante', 'KidsMante');
                break;
              case 'juvenil':
                this.secondPlace(proyecto, autores, 'mante', 'JuvenilMante');
                break;
              case 'media-superior':
                this.secondPlace(proyecto, autores, 'mante', 'MSMante');
                break;
              case 'superior':
                this.secondPlace(proyecto, autores, 'mante', 'SuperiorMante');
                break;
              case 'posgrado':
                this.secondPlace(proyecto, autores, 'mante', 'PosgradoMante');
                break;
            }
            break;
          case '2':
            switch (this.formsFiltro.value['id_categorias']) {
              case 'petit':
                this.secondPlace(proyecto, autores, 'reynosa', 'PetitReynosa');
                break;
              case 'kids':
                this.secondPlace(proyecto, autores, 'reynosa', 'KidsReynosa');
                break;
              case 'juvenil':
                this.secondPlace(proyecto, autores, 'reynosa', 'JuvenilReynosa');
                break;
              case 'media-superior':
                this.secondPlace(proyecto, autores, 'reynosa', 'MSReynosa');
                break;
              case 'superior':
                this.secondPlace(proyecto, autores, 'reynosa', 'SuperiorReynosa');
                break;
              case 'posgrado':
                this.secondPlace(proyecto, autores, 'reynosa', 'PosgradoReynosa');
                break;
            }
            break;
          case '3':
            switch (this.formsFiltro.value['id_categorias']) {
              case 'petit':
                this.secondPlace(proyecto, autores, 'matamoros', 'PetitMatamoros');
                break;
              case 'kids':
                this.secondPlace(proyecto, autores, 'matamoros', 'KidsMatamoros');
                break;
              case 'juvenil':
                this.secondPlace(proyecto, autores, 'matamoros', 'JuvenilMatamoros');
                break;
              case 'media-superior':
                this.secondPlace(proyecto, autores, 'matamoros', 'MSMatamoros');
                break;
              case 'superior':
                this.secondPlace(proyecto, autores, 'matamoros', 'SuperiorMatamoros');
                break;
              case 'posgrado':
                this.secondPlace(proyecto, autores, 'matamoros', 'PosgradoMatamoros');
                break;
            }
            break;
          case '4':
            switch (this.formsFiltro.value['id_categorias']) {
              case 'petit':
                this.secondPlace(proyecto, autores, 'madero', 'PetitMadero');
                break;
              case 'kids':
                this.secondPlace(proyecto, autores, 'madero', 'KidsMadero');
                break;
              case 'juvenil':
                this.secondPlace(proyecto, autores, 'madero', 'JuvenilMadero');
                break;
              case 'media-superior':
                this.secondPlace(proyecto, autores, 'madero', 'MSMadero');
                break;
              case 'superior':
                this.secondPlace(proyecto, autores, 'madero', 'SuperiorMadero');
                break;
              case 'posgrado':
                this.secondPlace(proyecto, autores, 'madero', 'PosgradoMadero');
                break;
            }
            break;
          case '5':
            switch (this.formsFiltro.value['id_categorias']) {
              case 'petit':
                this.secondPlace(proyecto, autores, 'jaumave', 'PetitJaumave');
                break;
              case 'kids':
                this.secondPlace(proyecto, autores, 'jaumave', 'KidsJaumave');
                break;
              case 'juvenil':
                this.secondPlace(proyecto, autores, 'jaumave', 'JuvenilJaumave');
                break;
              case 'media-superior':
                this.secondPlace(proyecto, autores, 'jaumave', 'MSJaumave');
                break;
              case 'superior':
                this.secondPlace(proyecto, autores, 'jaumave', 'SuperiorJaumave');
                break;
              case 'posgrado':
                this.secondPlace(proyecto, autores, 'jaumave', 'PosgradoJaumave');
                break;
            }
            break;
          case '6':
            switch (this.formsFiltro.value['id_categorias']) {
              case 'petit':
                this.secondPlace(proyecto, autores, 'nuevo-laredo', 'PetitNuevoLaredo');
                break;
              case 'kids':
                this.secondPlace(proyecto, autores, 'nuevo-laredo', 'KidsNuevoLaredo');
                break;
              case 'juvenil':
                this.secondPlace(proyecto, autores, 'nuevo-laredo', 'JuvenilNuevoLaredo');
                break;
              case 'media-superior':
                this.secondPlace(proyecto, autores, 'nuevo-laredo', 'MSNuevoLaredo');
                break;
              case 'superior':
                this.secondPlace(proyecto, autores, 'nuevo-laredo', 'SuperiorNuevoLaredo');
                break;
              case 'posgrado':
                this.secondPlace(proyecto, autores, 'nuevo-laredo', 'PosgradoNuevoLaredo');
                break;
            }
            break;
          case '7':
            switch (this.formsFiltro.value['id_categorias']) {
              case 'petit':
                this.secondPlace(proyecto, autores, 'victoria', 'PetitVictoria');
                break;
              case 'kids':
                this.secondPlace(proyecto, autores, 'victoria', 'KidsVictoria');
                break;
              case 'juvenil':
                this.secondPlace(proyecto, autores, 'victoria', 'JuvenilVictoria');
                break;
              case 'media-superior':
                this.secondPlace(proyecto, autores, 'victoria', 'MSVictoria');
                break;
              case 'superior':
                this.secondPlace(proyecto, autores, 'victoria', 'SuperiorVictoria');
                break;
              case 'posgrado':
                this.secondPlace(proyecto, autores, 'victoria', 'PosgradoVictoria');
                break;
            }
            break;
        }
      } else {
        if (index === 2) {
          if (!autores) {
            swal.fire({
              icon: 'error',
              title: 'No tienes autores registrados en este proyecto, agrega para descargar.'
            });
          }
          console.log(index);
          console.log(this.formsFiltro.value['id_categorias']);
          switch (this.sessionData.id_sedes) {
            case '1':
              switch (this.formsFiltro.value['id_categorias']) {
                case 'petit':
                  this.thirdPlace(proyecto, autores, 'mante', 'PetitMante');
                  break;
                case 'kids':
                  this.thirdPlace(proyecto, autores, 'mante', 'KidsMante');
                  break;
                case 'juvenil':
                  this.thirdPlace(proyecto, autores, 'mante', 'JuvenilMante');
                  break;
                case 'media-superior':
                  this.thirdPlace(proyecto, autores, 'mante', 'MSMante');
                  break;
                case 'superior':
                  this.thirdPlace(proyecto, autores, 'mante', 'SuperiorMante');
                  break;
                case 'posgrado':
                  this.thirdPlace(proyecto, autores, 'mante', 'PosgradoMante');
                  break;
              }

              break;
            case '2':
              switch (this.formsFiltro.value['id_categorias']) {
                case 'petit':
                  this.thirdPlace(proyecto, autores, 'reynosa', 'PetitReynosa');
                  break;
                case 'kids':
                  this.thirdPlace(proyecto, autores, 'reynosa', 'KidsReynosa');
                  break;
                case 'juvenil':
                  this.thirdPlace(proyecto, autores, 'reynosa', 'JuvenilReynosa');
                  break;
                case 'media-superior':
                  this.thirdPlace(proyecto, autores, 'reynosa', 'MSReynosa');
                  break;
                case 'superior':
                  this.thirdPlace(proyecto, autores, 'reynosa', 'SuperiorReynosa');
                  break;
                case 'posgrado':
                  this.thirdPlace(proyecto, autores, 'reynosa', 'PosgradoReynosa');
                  break;
              }
              break;
            case '3':
              switch (this.formsFiltro.value['id_categorias']) {
                case 'petit':
                  this.thirdPlace(proyecto, autores, 'matamoros', 'PetitMatamoros');
                  break;
                case 'kids':
                  this.thirdPlace(proyecto, autores, 'matamoros', 'KidsMatamoros');
                  break;
                case 'juvenil':
                  this.thirdPlace(proyecto, autores, 'matamoros', 'JuvenilMatamoros');
                  break;
                case 'media-superior':
                  this.thirdPlace(proyecto, autores, 'matamoros', 'MSMatamoros');
                  break;
                case 'superior':
                  this.thirdPlace(proyecto, autores, 'matamoros', 'SuperiorMatamoros');
                  break;
                case 'posgrado':
                  this.thirdPlace(proyecto, autores, 'matamoros', 'PosgradoMatamoros');
                  break;
              }
              break;
            case '4':
              switch (this.formsFiltro.value['id_categorias']) {
                case 'petit':
                  this.thirdPlace(proyecto, autores, 'madero', 'PetitMadero');
                  break;
                case 'kids':
                  this.thirdPlace(proyecto, autores, 'madero', 'KidsMadero');
                  break;
                case 'juvenil':
                  this.thirdPlace(proyecto, autores, 'madero', 'JuvenilMadero');
                  break;
                case 'media-superior':
                  this.thirdPlace(proyecto, autores, 'madero', 'MSMadero');
                  break;
                case 'superior':
                  this.thirdPlace(proyecto, autores, 'madero', 'SuperiorMadero');
                  break;
                case 'posgrado':
                  this.thirdPlace(proyecto, autores, 'madero', 'PosgradoMadero');
                  break;
              }
              break;
            case '5':
              switch (this.formsFiltro.value['id_categorias']) {
                case 'petit':
                  this.thirdPlace(proyecto, autores, 'jaumave', 'PetitJaumave');
                  break;
                case 'kids':
                  this.thirdPlace(proyecto, autores, 'jaumave', 'KidsJaumave');
                  break;
                case 'juvenil':
                  this.thirdPlace(proyecto, autores, 'jaumave', 'JuvenilJaumave');
                  break;
                case 'media-superior':
                  this.thirdPlace(proyecto, autores, 'jaumave', 'MSJaumave');
                  break;
                case 'superior':
                  this.thirdPlace(proyecto, autores, 'jaumave', 'SuperiorJaumave');
                  break;
                case 'posgrado':
                  this.thirdPlace(proyecto, autores, 'jaumave', 'PosgradoJaumave');
                  break;
              }
              break;
            case '6':
              switch (this.formsFiltro.value['id_categorias']) {
                case 'petit':
                  this.thirdPlace(proyecto, autores, 'nuevo-laredo', 'PetitNuevoLaredo');
                  break;
                case 'kids':
                  this.thirdPlace(proyecto, autores, 'nuevo-laredo', 'KidsNuevoLaredo');
                  break;
                case 'juvenil':
                  this.thirdPlace(proyecto, autores, 'nuevo-laredo', 'JuvenilNuevoLaredo');
                  break;
                case 'media-superior':
                  this.thirdPlace(proyecto, autores, 'nuevo-laredo', 'MSNuevoLaredo');
                  break;
                case 'superior':
                  this.thirdPlace(proyecto, autores, 'nuevo-laredo', 'SuperiorNuevoLaredo');
                  break;
                case 'posgrado':
                  this.thirdPlace(proyecto, autores, 'nuevo-laredo', 'PosgradoNuevoLaredo');
                  break;
              }
              break;
            case '6':
              switch (this.formsFiltro.value['id_categorias']) {
                case 'petit':
                  this.thirdPlace(proyecto, autores, 'victoria', 'PetitVictoria');
                  break;
                case 'kids':
                  this.thirdPlace(proyecto, autores, 'victoria', 'KidsVictoria');
                  break;
                case 'juvenil':
                  this.thirdPlace(proyecto, autores, 'victoria', 'JuvenilVictoria');
                  break;
                case 'media-superior':
                  this.thirdPlace(proyecto, autores, 'victoria', 'MSVictoria');
                  break;
                case 'superior':
                  this.thirdPlace(proyecto, autores, 'victoria', 'SuperiorVictoria');
                  break;
                case 'posgrado':
                  this.thirdPlace(proyecto, autores, 'victoria', 'PosgradoVictoria');
                  break;
              }
              break;
          }
        } else {
          swal.fire({
            icon: 'error',
            title: 'Solo puedes imprimir los 3 primeros lugares'
          });
        }
      }
    }
  }

  firstPlace({ nombre = '' }, autores: any[], sede: string = '', categoriaSede: string = '') {
    //console.log(autores[0].autor);
    let array = 1;
    for (let i = 0; i < autores.length; i++) {
      const doc5 = new jsPDF();
      doc5.addImage('assets/image/diploma/' + sede + '/Primero' + categoriaSede + '.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
      doc5.text(autores[i].autor, 80, 175).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc5.text(nombre, 85, 215);
      doc5.setFontSize(16);
      doc5.setFont('Helvetica');
      doc5.save("constancia Primer Lugar proyecto " + nombre + ".pdf");
    }
  }

  secondPlace({ nombre = '' }, autores: any[], sede: string, categoriaSede: string) {
    for (let i = 0; i < autores.length; i++) {
      console.log(nombre);
      const doc6 = new jsPDF();
      doc6.addImage('assets/image/diploma/' + sede.toString() + '/Segundo' + categoriaSede.toString() + '.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
      doc6.text(autores[i].autor, 80, 175).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc6.text(nombre, 85, 215);
      doc6.setFontSize(16);
      doc6.setFont('Helvetica');
      doc6.save("constancia Segundo Lugar proyecto " + nombre + ".pdf");
    }
  }
  thirdPlace({ nombre = '' }, autores: any[], sede: string, categoriaSede: string) {
    for (let i = 0; i < autores.length; i++) {
      const doc7 = new jsPDF();
      doc7.addImage('assets/image/diploma/' + sede + '/Tercero' + categoriaSede + '.jpg', 'jpg', 0, 0, 210, 300).setFont('Helvetica').setFontSize(28).setTextColor('#646464');
      doc7.text(autores[i].autor, 80, 175).setFontSize(20).setFont('Helvetica').setTextColor('#646464');
      doc7.text(nombre, 85, 215);
      doc7.setFontSize(16);
      doc7.setFont('Helvetica');
      doc7.save("constancia Tercer Lugar proyecto " + nombre + ".pdf");
    }
  }

  imprimir(proyecto: any, categoria: any) {

    switch (categoria) {
      case 'petit':
        let nombrePetit = '';
        let totalPetit = '';
        let sedePetit2 = '';
        for (let i = 0; i < proyecto.length; i++) {

          nombrePetit = nombrePetit.concat(proyecto[i].nombre, '\r\n');
          totalPetit = totalPetit.concat(Math.round(parseInt(proyecto[i].total)).toString(), '\r\n');
          sedePetit2 = sedePetit2.concat(proyecto[i].sede, '\r\n');

        }
        const doc1 = new jsPDF({orientation: 'landscape'});
        doc1.addImage('assets/image/logotamColor.png','png', 14, 13, 48,24);
        doc1.addImage('assets/image/cecit.png','png', 243, 8, 39,39).setFont('Caviar').setFontSize(20).setTextColor('#646464');
        doc1.text('Consejo Tamaulipeco de Ciencia y Tecnología', 85, 34).setFont('Caviar').setFontSize(18).setTextColor('#646464');
        doc1.text('Lista de Proyectos Categoría Superior sede '+sedePetit2+'', 84, 46).setFont('Caviar').setFontSize(16).setTextColor('#646464');
        doc1.text('Proyecto', 35, 75);
        doc1.text(nombrePetit, 35, 90);
        doc1.text('Calificación', 220, 75);
        doc1.text(totalPetit, 220,  90);
    
        doc1.setFontSize(16);
        doc1.setFont('Caviar');
        doc1.save("lista petit.pdf");
        break;

      case 'kids':
        console.log('hola' + categoria);
        let nombreKids = '';
        let totalKids = '';
        let sedeKids = '';
        for (let i = 0; i < proyecto.length; i++) {

          nombreKids = nombreKids.concat(proyecto[i].nombre, '\r\n');
          totalKids = totalKids.concat(Math.round(parseInt(proyecto[i].total)).toString(), '\r\n');
          sedeKids = sedeKids.concat(proyecto[i].sede, '\r\n');

        }
        const doc8 = new jsPDF({orientation: 'landscape', unit: 'in', format: [4,2]});
        doc8.addImage('assets/image/logotamColor.png','png', 12, 13, 38,17);
        doc8.addImage('assets/image/cecit.png','png', 164, 8, 35,35).setFont('Caviar').setFontSize(18).setTextColor('#646464');
        doc8.text('Consejo Tamaulipeco de Ciencia y Tecnología', 44, 37).setFont('Caviar').setFontSize(16).setTextColor('#646464');
        doc8.text('Lista de Proyectos Categoría Kids', 64, 49).setFont('Caviar').setFontSize(16).setTextColor('#646464');
        doc8.text('Proyecto', 35, 75);
        doc8.text(nombreKids, 35, 90);
        doc8.text('Calificación', 220, 75);
        doc8.text(totalKids, 220,  90);

        doc8.setFontSize(16);
        doc8.setFont('Caviar');
        doc8.save("lista kids.pdf");

        break;

      case 'juvenil':
        console.log('hola' + categoria);
        let nombreJuvenil = '';
        let totalJuvenil = '';
        let sedeJuvenil = '';
        for (let i = 0; i < proyecto.length; i++) {

          nombreJuvenil = nombreJuvenil.concat(proyecto[i].nombre, '\r\n');
          totalJuvenil = totalJuvenil.concat(Math.round(parseInt(proyecto[i].total)).toString(), '\r\n');
          sedeJuvenil = sedeJuvenil.concat(proyecto[i].sede, '\r\n');

        }
        const doc7 = new jsPDF({orientation: 'landscape'});
        doc7.addImage('assets/image/logotamColor.png','png', 14, 13, 48,24);
        doc7.addImage('assets/image/cecit.png','png', 243, 8, 39,39).setFont('Caviar').setFontSize(20).setTextColor('#646464');
        doc7.text('Consejo Tamaulipeco de Ciencia y Tecnología', 85, 34).setFont('Caviar').setFontSize(18).setTextColor('#646464');
        doc7.text('Lista de Proyectos Categoría Superior sede '+sedeJuvenil+'', 84, 46).setFont('Caviar').setFontSize(16).setTextColor('#646464');
        doc7.text('Proyecto', 35, 75);
        doc7.text(nombreJuvenil, 35, 90);
        doc7.text('Calificación', 220, 75);
        doc7.text(totalJuvenil, 220,  90);
      
        doc7.setFontSize(16);
        doc7.setFont('Caviar');
        doc7.save("lista juvenil.pdf");
        break;

      case 'media-superior':
        console.log('hola' + categoria);
        let nombreMS = '';
        let totalMS = '';
        let sedeMS = '';
        for (let i = 0; i < proyecto.length; i++) {

          nombreMS = nombreMS.concat(proyecto[i].nombre, '\r\n');
          totalMS = totalMS.concat(Math.round(parseInt(proyecto[i].total)).toString(), '\r\n');
          sedeMS = sedeMS.concat(proyecto[i].sede, '\r\n');

        }
        const doc2 = new jsPDF({orientation: 'landscape'});
        doc2.addImage('assets/image/logotamColor.png','png', 14, 13, 48,24);
        doc2.addImage('assets/image/cecit.png','png', 243, 8, 39,39).setFont('Caviar').setFontSize(20).setTextColor('#646464');
        doc2.text('Consejo Tamaulipeco de Ciencia y Tecnología', 85, 34).setFont('Caviar').setFontSize(18).setTextColor('#646464');
        doc2.text('Lista de Proyectos Categoría Superior sede '+sedeMS+'', 84, 46).setFont('Caviar').setFontSize(16).setTextColor('#646464');
        doc2.text('Proyecto', 35, 75);
        doc2.text(nombreMS, 35, 90);
        doc2.text('Calificación', 220, 75);
        doc2.text(totalMS, 220,  90)
        doc2.setFontSize(16);
        doc2.setFont('Caviar');
        doc2.save("lista media-superior.pdf");

        break;

      case 'superior':
        console.log('hola' + categoria);
        let nombreSuperior = '';
        let totalSuperior = '';
        let sedeSuperior = '';
        for (let i = 0; i < proyecto.length; i++) {

          nombreSuperior = nombreSuperior.concat(proyecto[i].nombre, '\r\n');
          totalSuperior = totalSuperior.concat(Math.round(parseInt(proyecto[i].total)).toString(), '\r\n');
          sedeSuperior = sedeSuperior.concat(proyecto[i].sede, '\r\n');

        }
        const doc3 = new jsPDF({orientation: 'landscape'});
        doc3.addImage('assets/image/logotamColor.png','png', 14, 13, 48,24);
        doc3.addImage('assets/image/cecit.png','png', 243, 8, 39,39).setFont('Caviar').setFontSize(20).setTextColor('#646464');
        doc3.text('Consejo Tamaulipeco de Ciencia y Tecnología', 85, 34).setFont('Caviar').setFontSize(18).setTextColor('#646464');
        doc3.text('Lista de Proyectos Categoría Superior sede '+sedeSuperior+'', 84, 46).setFont('Caviar').setFontSize(16).setTextColor('#646464');
        doc3.text('Proyecto', 35, 75);
        doc3.text(nombreSuperior, 35, 90);
        doc3.text('Calificación', 220, 75);
        doc3.text(totalSuperior, 220,  90);
        doc3.setFontSize(16);
        doc3.setFont('Caviar');
        doc3.save("lista superior.pdf");

        break;

      case 'posgrado':
        console.log('hola' + categoria);
        let nombrePosgrado = '';
        let totalPosgrado = '';
        let sedePosgrado = '';
        for (let i = 0; i < proyecto.length; i++) {

          nombrePosgrado = nombrePosgrado.concat(proyecto[i].nombre, '\r\n');
          totalPosgrado = totalPosgrado.concat(Math.round(parseInt(proyecto[i].total)).toString(), '\r\n');
          sedePosgrado = sedePosgrado.concat(proyecto[i].sede, '\r\n');

        }
        const doc4 = new jsPDF({orientation: 'landscape'});
        doc4.addImage('assets/image/logotamColor.png','png', 14, 13, 48,24);
        doc4.addImage('assets/image/cecit.png','png', 243, 8, 39,39).setFont('Caviar').setFontSize(20).setTextColor('#646464');
        doc4.text('Consejo Tamaulipeco de Ciencia y Tecnología', 85, 34).setFont('Caviar').setFontSize(18).setTextColor('#646464');
        doc4.text('Lista de Proyectos Categoría Superior sede '+sedePosgrado+'', 84, 46).setFont('Caviar').setFontSize(16).setTextColor('#646464');
        doc4.text('Proyecto', 35, 75);
        doc4.text(nombrePosgrado, 35, 90);
        doc4.text('Calificación', 220, 75);
        doc4.text(totalPosgrado, 220,  90);
        
        doc4.setFontSize(16);
        doc4.setFont('Caviar');
        doc4.save("lista posgrado.pdf");

        break;
      default:
        swal.fire({
          icon: 'error',
          title: 'No se encontró la categoría'
        });
        break;

    }
  }
}

