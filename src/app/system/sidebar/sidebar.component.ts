import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../models/session.model';
import { CategoriasService } from 'src/app/services/categorias.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public categoria: string;
  sessionData: Session;

  constructor(
    private router: Router,
    private categoriasService: CategoriasService,
    private _utilService: UtilsService ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.categoria = 'Cargando...';
  }
  admin: boolean;
  ngOnInit(): void {
    this.admin = false;
    this.categoriasService.getCategorias().subscribe( data => {
      this.categoria = data.categoria;
      if ( this.sessionData.usuario === 'admin' ) {
        this.admin = true;
      }
    });
  }
  cerrarSesion() {
    this._utilService.loading = true;
    setTimeout(() => {
      this._utilService.loading = false;
      localStorage.removeItem('session');
      this.router.navigateByUrl('/');
    }, 2000);
  }
}
