import { Component, OnInit } from '@angular/core';
import { ProjectsRegisteredService } from '../services/project-registered.service'
import { ProjectsRegistered } from '../models/project-regis.model';
import { UtilsService } from '../services/utils.service';


@Component({
  selector: 'app-projects-registered',
  templateUrl: './projects-registered.component.html',
  styleUrls: ['./projects-registered.component.scss']
})
export class ProjectsRegisteredComponent implements OnInit {

  proyectos: ProjectsRegistered[];

  constructor(
    private projectsService: ProjectsRegisteredService,
    private _utilService: UtilsService
  ) {
    this.proyectos = new Array<ProjectsRegistered>();
    this._utilService.loading = true;
    
   }

  ngOnInit(): void {
    
    this.projectsService.getProjects().subscribe(
      data => {
        this.proyectos = data;
        console.log(this.proyectos);
      },
      err => {
        console.log(err);
      }
    ).add(() => {
      this._utilService.loading = false;
    });
  }

}
