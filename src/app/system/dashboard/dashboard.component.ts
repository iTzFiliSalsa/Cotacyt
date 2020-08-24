import { Component, OnInit } from '@angular/core';
import { AreasService } from 'src/app/services/areas.service';
import { Subscriber } from 'rxjs';


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

  


  constructor(private _areaservice:AreasService) { }

  ngOnInit(): void {
    this._areaservice.get().subscribe(
      res=>{console.log(res);},
      error=>{}
    );
  }


}
