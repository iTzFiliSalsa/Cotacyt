import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, plugins } from 'chart.js';
import plugin, * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, defaultColors, Label } from 'ng2-charts';
import jsPDF from 'jspdf';
import { ProyectosService } from '../services/proyectos.service';

@Component({
  selector: 'app-gra-for-proy',
  templateUrl: './gra-for-proy.component.html',
  styleUrls: ['./gra-for-proy.component.scss']
})
export class GraForProyComponent implements OnInit {

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
  public barChartLabels: Label[] = ['Petit', 'Kids', 'Juvenil', 'Media superior', 'Superior', 'Posgrado'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[];

  participantesCat:[];
  constructor(private participantesPorCat: ProyectosService) { }

  ngOnInit() {
    this.barChartData = [{
      data: [],
      label: 'Participantes por categoría'
    }];
    this.participantesPorCat.getParticipantesPorCategoria().subscribe(
      data => {
        this.participantesCat = data;
        const cat1 = data['petit'];
        const cat2 = data['kids'];
        const cat3 = data['juvenil'];
        const cat4 = data['media-superior'];
        const cat5 = data['superior'];
        const cat6 = data['posgrado'];

        this.barChartData = [{
          data: [cat1, cat2, cat3, cat4, cat5, cat6],
          label: 'Participantes por categoría'
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
    var canvas: any = document.getElementById('graficaProy6');
    //creates image
    var canvasImg = canvas.toDataURL("image/png", 1.0);
    
    //creates PDF from img
    var doc = new jsPDF('landscape');
    doc.setFontSize(20);
    doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150 );
    doc.save('Participantes-Por-Categoria.pdf');
  }

}
