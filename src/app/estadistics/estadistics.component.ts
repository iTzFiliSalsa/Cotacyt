import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, plugins } from 'chart.js';
import plugin, * as pluginDataLabels from 'chartjs-plugin-datalabels';
import jsPDF from 'jspdf';
import { Color, defaultColors, Label } from 'ng2-charts';
import { EstadisticasService } from '../services/estadisticas.service';


@Component({
  selector: 'app-estadistics-component',
  templateUrl: './estadistics.component.html',
  styleUrls: ['./estadistics.component.scss']
})
export class EstadisticsComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [
      {
        ticks: {
          beginAtZero: true
          }
      }] },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: 'black',
      },
    }
  };
  public barChartColors: Color[] = [
    { backgroundColor: '#97c83c'},
  ];
  public barChartLabels: Label[] = ['El Mante', 'Jaumave', 'Madero', 'Matamoros', 'Nuevo Laredo', 'Reynosa', 'Victoria'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[];

  estadisticas:[];

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    this.barChartData = [{
      data: [],
      label: 'Proyectos por sede'
    }];
    this.estadisticasService.getEstadisticas().subscribe(
      data => {
        this.estadisticas = data;
        console.log(data);
        
        const sede1 = data['El Mante'];
        const sede2 = data['Jaumave'];
        const sede3 = data['Madero'];
        const sede4 = data['Matamoros'];
        const sede5 = data['Nuevo Laredo'];
        const sede6 = data['Reynosa'];
        const sede7 = data['Victoria'];
        
        this.barChartData = [{
          data: [sede1, sede2, sede3, sede4, sede5, sede6, sede7],
          label: 'Proyectos Por Sede'
        }];
      },
      err => {
        console.log(err);
      }
    );
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  

  downloadPDF() {
    var canvas: any = document.getElementById('graficaProy1');
    //creates image
    var canvasImg = canvas.toDataURL("image/png", 1.0);
    //creates PDF from img
    var doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.addImage('assets/logotamColor.png', 'png', 9, 7, 57, 28);
    doc.addImage('assets/cecit.png','png', 243, 5, 50, 40);
    doc.addImage(canvasImg, 'JPEG', 15, 50, 260, 135 );
    doc.save('Proyectos-Por-Sede.pdf');
  }


}