import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, Router } from '@angular/router';
import { JudgesRegisteredService } from '../services/judges.service'
import { JudgesRegistered } from '../models/judges.model';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-judges',
  templateUrl: './judges.component.html',
  styleUrls: ['./judges.component.scss']
})
export class JudgesComponent implements OnInit {

  jueces: JudgesRegistered[];
  constructor(
    private judgesService: JudgesRegisteredService,
    private _utilService: UtilsService) { 
    this.jueces = new Array<JudgesRegistered>();
    this._utilService.loading = true;
  }

  ngOnInit(): void {

    

    this.judgesService.getJudges().subscribe(
      data => {
        this.jueces = data;
      },
      err => {
        console.log(err);
      }).add(() => {
        this._utilService.loading = false;
      });

  }
 
}
