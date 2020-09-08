import { Component, OnInit } from '@angular/core';
import { RouterLinkActive, Router } from '@angular/router';
import { JudgesRegisteredService } from '../services/judges.service'
import { JudgesRegistered } from '../models/judges.model';

@Component({
  selector: 'app-judges',
  templateUrl: './judges.component.html',
  styleUrls: ['./judges.component.scss']
})
export class JudgesComponent implements OnInit {

  jueces: JudgesRegistered[];
  constructor(private judgesService: JudgesRegisteredService) { 
    this.jueces = new Array<JudgesRegistered>();
  }

  ngOnInit(): void {

    this.judgesService.getJudges().subscribe(
      data => {
        this.jueces = data;
      },
      err => {
        console.log(err);
      });

  }
 
}
