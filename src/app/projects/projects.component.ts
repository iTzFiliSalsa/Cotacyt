import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ProyectosCalificados, ProyectosPorCalificar } from '../models/dashboard.model';
import { ServicesConfig } from '../config/services.config';
import { CategoriasService } from '../services/categorias.service';
import { ProyectosService } from '../services/proyectos.service';
import { Proyectos } from '../models/proyectos.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  categoria: string;
  proyectosCalificados: ProyectosCalificados[];
  proyectosPorCalificar: ProyectosPorCalificar[];
  proyectoActual: Proyectos;
  constructor(private dashboardService: DashboardService,
              private categoriasService: CategoriasService,
              private proyectosService: ProyectosService) {
    this.proyectosCalificados = new Array<ProyectosCalificados>();
  }

  ngOnInit(): void {
    // obtiene los proyectos calificados
    this.dashboardService.getProyectosCalificados().subscribe(
      (data: any) => this.proyectosCalificados = data.proyectos_calificados,
      err => console.log(err));
    // obtiene los proyectos por calificar
    this.dashboardService.getProyectosPorCalificar().subscribe(
      (data: any) => this.proyectosPorCalificar = data.proyectos_por_calificar,
      err => console.log(err));
      // Trae la categoria actual
    this.categoriasService.getCategorias().subscribe( data => {
        this.categoria = data.categoria;
      });
  }
  traerProyecto( idProyecto: string ) {
    this.proyectosService.obtenerProyecto( idProyecto ).subscribe(
      data => this.proyectoActual = data,
      err => console.log(err)
    );
  }

}
