import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  sessionData: Session[];
  constructor( private router: Router ) {
    this.sessionData = new Array<Session>();
    this.sessionData = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit(): void {
  }
  cerrarSesion() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('/');
  }
}
