import { Component, OnInit } from '@angular/core';
import { AreasService } from 'src/app/services/areas.service';
import { Subscriber } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { JsonPipe } from '@angular/common';
import { Totales, ProyectosCalificados, ProyectosPorCalificar } from '../../models/dashboard.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    // graficas
  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartOptions: any = {
    responsive: true,
  };

  public barChartType: string = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];



  totales: Totales[];
  proyectosCalificados: ProyectosCalificados[];
  proyectosPorCalificar: ProyectosPorCalificar[];

  constructor(private dashboardService: DashboardService) {
    this.totales = new Array<Totales>();
    this.proyectosCalificados = new Array<ProyectosCalificados>();
  }

  ngOnInit(): void {

    this.dashboardService.getTotales().subscribe( (data) => this.totales = data );

    this.dashboardService.getProyectosPorCategorias().subscribe( data => {
      console.log ( data );
    });

    this.dashboardService.getProyectosCalificados().subscribe(
      (data: any) => this.proyectosCalificados = data.proyectos_calificados );

    this.dashboardService.getProyectosPorCalificar().subscribe(
      (data: any) => this.proyectosPorCalificar = data.proyectos_por_calificar );
  }


}
