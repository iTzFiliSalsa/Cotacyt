import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cotacyt';

  constructor(
    private router: Router,
    public _utilService: UtilsService
    ) { }

  ngOnInit(): void {
      // if (!localStorage.getItem('session')) {
      //   this.router.navigateByUrl('/');
      // } else {
      //   this.router.navigateByUrl('home');
      // }
  }

}
