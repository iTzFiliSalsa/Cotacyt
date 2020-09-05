import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../models/session.model';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public categoria: string;
  sessionData: Session[];

  constructor( private router: Router,
    private categoriasService: CategoriasService ) {
    this.sessionData = new Array<Session>();
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.categoria = 'Cargando...'
  }

  ngOnInit(): void {
    this.categoriasService.getCategorias().subscribe( data => {
      this.categoria = data.categoria;
    });
  }
  cerrarSesion() {
    localStorage.removeItem('session');
    this.router.navigateByUrl('/');
  }
}
