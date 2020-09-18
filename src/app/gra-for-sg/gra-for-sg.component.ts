import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, plugins } from 'chart.js';
import plugin, * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, defaultColors, Label } from 'ng2-charts';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-gra-for-sg',
  templateUrl: './gra-for-sg.component.html',
  styleUrls: ['./gra-for-sg.component.scss']
})
export class GraForSGComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center',
        color: 'black',
      }
    }
  };

  public barChartColors: Color[] = [
    { backgroundColor: '#97c83c'},
  ];
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor() { }

  ngOnInit() {
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

  downloadPDF() {
    var canvas: any = document.getElementById('graficaProy2');
    //creates image
    var canvasImg = canvas.toDataURL("image/jpeg", 1.0);
    
    //creates PDF from img
    var doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150 );
    doc.save('canvas.pdf');
  }

}
