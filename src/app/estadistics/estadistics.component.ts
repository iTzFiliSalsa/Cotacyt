import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
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
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
      },
    }
  };
  public barChartColors: Color[] = [
    { backgroundColor: '#97c83c'},
  ]
  public barChartLabels: Label[] = ['El Mante', 'Jaumave', 'Madero', 'Matamoros', 'Nuevo Laredo', 'Reynosa'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[];

  estadisticas:[];

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit(): void {
    this.barChartData = [{
      data: [],
      label: 'Proyectos Por Sede'
    }];
    this.estadisticasService.getEstadisticas().subscribe(
      data => {
        this.estadisticas = data;
        const sede1 = data['El Mante'];
        const sede2 = data['Jaumave'];
        const sede3 = data['Madero'];
        const sede4 = data['Matamoros'];
        const sede5 = data['Nuevo Laredo'];
        const sede6 = data['Reynosa'];
        
        this.barChartData = [{
          data: [sede1,sede2,sede3,sede4,sede5,sede6],
          label: 'Proyectos Por Sede'
        }];

        console.log(sede1);
        console.log(this.estadisticas);
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

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }

  downloadPDF(evt: any) {
    var canvas = document.querySelector('#graficaProy1');
    //creates image
    var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
    
    //creates PDF from img
    var doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150 );
    doc.save('canvas.pdf');
  }


}
