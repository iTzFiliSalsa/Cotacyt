import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { JsonPipe } from '@angular/common';
import { Totales, ProyectosCalificados, ProyectosPorCalificar } from '../../models/dashboard.model';
import { Session } from 'src/app/models/session.model';
import { CategoriasService } from '../../services/categorias.service';
import { CalificacionesService } from '../../services/calificaciones.service';
import { Calificaciones } from '../../models/calificaciones.model';
import { UtilsService } from 'src/app/services/utils.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
  @ViewChild("modal") test: any;
  public barChartColors: Color[] = [
    { backgroundColor: '#007d97' },
  ];
  public barChartLabels: Label[] = ['Petit', 'Kids', 'Juvenil', 'Media Superior', 'Superior', 'Posgrado'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[];
  public hT: any;

  totales: Totales[];
  categoria: string;
  proyectosCalificados: ProyectosCalificados[];
  proyectosPorCalificar: ProyectosPorCalificar[];
  estadisticasDeProyectos: Calificaciones[];
  sessionData: Session[];
  constructor(private dashboardService: DashboardService,
              private categoriasService: CategoriasService,
              private calificacionesService: CalificacionesService,
              private _utilsService: UtilsService
              ) {
    this.totales = new Array<Totales>();
    this.proyectosCalificados = new Array<ProyectosCalificados>();
    this.sessionData = new Array<Session>();
    this.estadisticasDeProyectos = new Array<Calificaciones>();
    this._utilsService.loading = true;
  }

  ngOnInit(): void {

    this.getTime();

    this.barChartData = [
      { data: [], label: 'Proyectos' }
    ];

    // obtiene los totales
    this.dashboardService.getTotales().subscribe(
      (data) => this.totales = data,
      err => console.log( err ) );
    // obtiene los proyectos por categorias
    this.dashboardService.getProyectosPorCategorias().subscribe(
      data => {
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
      err => console.log(err) );
    // obtiene los proyectos calificados
    this.dashboardService.getProyectosCalificados().subscribe(
      (data: any) => {
        this.proyectosCalificados = data.proyectos_calificados;
        this._utilsService.loading = false;
      },
      err => console.log(err) );
    // obtiene los proyectos por calificar
    this.dashboardService.getProyectosPorCalificar().subscribe(
      (data: any) => {
        this.proyectosPorCalificar = data.proyectos_por_calificar;
        console.log(this.proyectosPorCalificar);
      
      },
      err => console.log(err) );
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    // obtiene la categoria de la sesión actual
    this.categoriasService.getCategorias().subscribe( data => {
      this.categoria = data.categoria;
    });
    // Estadisticas
    this.calificacionesService.proyectosEstadisticas().subscribe(
      data => {
        this.estadisticasDeProyectos = data;
      },
      err => console.log(err)
    );
  }

  swalModal(text){
    swal.fire({
      title: 'Información del proyecto',
      text
    })
  }



  getPercent(porcentaje: string) {
    Number(porcentaje);
    return {
      width: porcentaje + '%'
    };
  }

  getTime(){
    var d = new Date();
    this.hT=d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    setTimeout(()=> {
      this.getTime();
    }, 1000);
    
  }
                                
  //document.write(‘Fecha: ‘+d.getDate(),'<br>Dia de la semana: ‘+d.getDay(),'<br>Mes (0 al 11): ‘+d.getMonth(),'<br>Año:’+d.getFullYear(),'<br>Hora:’+d.getHours(),'<br>HoraUTC: ‘+d.getUTCHours(),'<br>Minutos: ‘+d.getMinutes(),'<br>Segundos: ‘+d.getSeconds());
  


}
