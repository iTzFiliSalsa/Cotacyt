import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('mobile', {static: true}) mobile: ElementRef;
  public toggleClass: boolean = false;
  public categoria: string;
  sessionData: Session[];

  constructor( private router: Router,
    private categoriasService: CategoriasService,
    private _utilService: UtilsService ) {
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
    this._utilService.loading = true;
    setTimeout(() => {
      this._utilService.loading = false;
      localStorage.removeItem('session');
      this.router.navigateByUrl('/');
    }, 2000);
  }

  toggle(){
    if(!this.toggleClass){
      console.log(this.mobile.nativeElement.style.left = '-250px');
      this.toggleClass = true;
    }else{
      console.log(this.mobile.nativeElement.style.left = '0');
      this.toggleClass = false;
    }
  }
}
