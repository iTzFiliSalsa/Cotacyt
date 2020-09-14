import { Component, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

 

  @ViewChild('swalid') private swalCalificaciones: SwalComponent;
  @ViewChild('swalid1') private swalInformacion: SwalComponent;
  @ViewChild('swalid2') private swalReproductor: SwalComponent;


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
    this._utilsService.loading = true;
    this.util = new Util;
    this.proyectos = new Array<ProjectRegistered>();
    this.proyectosCalificadosPorCategoria = new Array<CalificacionesPorCategoria>();
  }

  ngOnInit(): void {

    setInterval(() => {
      var d = new Date();
      this.ht = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    }, 1000);

    this.barChartData = [
      { data: [], label: 'Proyectos' }
    ];

    // obtiene los totales
    this.dashboardService.getTotales().subscribe(
      (data) => this.totales = data,
      err => console.log(err));
    // obtiene los proyectos por categorias
    this.dashboardService.getProyectosPorCategorias().subscribe(
      data => {
        console.log(data);
        
        const petit = data.petit;
        const kids = data.kids;
        const juvenil = data.juvenil;
        const mediaSuperior = data['media-superior'];
        const superior = data.superior;
        const posgrado = data.posgrado;

        this.barChartData = [
          { data: [petit, kids, juvenil, mediaSuperior, superior, posgrado], label: 'Proyectos' }
        ];
      },
      err => console.log(err));

    if (this.sessionData.rol === 'admin') {
      this.projectsService.getProjects().subscribe(
        data => {
          this.proyectos = data;
          this.adminProjects(this.proyectos);
        },
        err => {
          console.log(err);
        }
      );
    } else {
      forkJoin({
        proyectosCalificados: this.dashboardService.getProyectosCalificados(),
        proyectosPorCalificar: this.dashboardService.getProyectosPorCalificar()
      }).subscribe(
        (data: any) => {
          console.log(data.proyectosCalificados);
          console.log(data.proyectosPorCalificar);
          this.proyectosCalificados = data.proyectosCalificados;
          this.proyectosPorCalificar = data.proyectosPorCalificar;
        },
        err => {
          console.log(err);
        }
      );
    }

    this.sessionData = JSON.parse(localStorage.getItem('session'));
    // obtiene la categoria de la sesión actual
    this.categoriasService.getCategorias().subscribe(data => {
      this.categoria = data.categoria;
    });
    // Estadisticas
    this.calificacionesService.proyectosEstadisticas().subscribe(
      data => {
        this.estadisticasDeProyectos = data;
      },
      err => console.log(err)
    ).add(() => {
      this._utilsService.loading = false;
    });





  }//cerrar on onit


  adminProjects(proyectos) {
    proyectos.filter((res) => {
      this.proyectosService.getStatusAdmin(res.id_proyectos)
      .subscribe( data => {
        if (data[0].status === 1) {
          this.proyectosCalificados.push(res);
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

        switch (this.formsFiltro.value['id_categorias']) {
          case 'petit':
            console.log(petit);
            this.proyectosCalificacion = petit;
            console.log(this.proyectosCalificacion.sort(function (prev: any, next: any) {
              return next.total - prev.total;
            }));
            break;

          case 'kids':
            console.log(kids);
            this.proyectosCalificacion = kids;
            break;

          case 'juvenil':
            console.log(juvenil);
            this.proyectosCalificacion = juvenil;
            break;

          case 'media-superior':
            console.log(mediaSuperior);
            this.proyectosCalificacion = mediaSuperior;
            break;

          case 'superior':
            console.log(superior);
            this.proyectosCalificacion = superior;
            break;

          case 'posgrado':
            console.log(posgrado);
            this.proyectosCalificacion = posgrado;

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
  mostrarInfoCalificados(proyecto:ProyectosCalificados) {
    this.swalInformacion.fire();
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


   //mostrar informacion de proyecto seleccionado
   mostrarInfoPorCalificar(proyecto:ProyectosPorCalificar) {
    this.swalInformacion.fire();
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



  abrirReproductor(evento:any){
    this.swalReproductor.fire();
  }


}






  //document.write(‘Fecha: ‘+d.getDate(),'<br>Dia de la semana: ‘+d.getDay(),'<br>Mes (0 al 11): ‘+d.getMonth(),'<br>Año:’+d.getFullYear(),'<br>Hora:’+d.getHours(),'<br>HoraUTC: ‘+d.getUTCHours(),'<br>Minutos: ‘+d.getMinutes(),'<br>Segundos: ‘+d.getSeconds());




