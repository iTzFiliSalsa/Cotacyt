import { Component, OnInit } from '@angular/core';
import { ProjectsRegisteredService } from '../services/project-registered.service'
import { ProjectsRegistered } from '../models/project-regis.model';


@Component({
  selector: 'app-projects-registered',
  templateUrl: './projects-registered.component.html',
  styleUrls: ['./projects-registered.component.scss']
})
export class ProjectsRegisteredComponent implements OnInit {
  proyectos: ProjectsRegistered[];
  constructor( private projectsService: ProjectsRegisteredService ) {
    this.proyectos = new Array<ProjectsRegistered>();
   }

  ngOnInit(): void {

    this.projectsService.getProjects().subscribe(
      data => {
        this.proyectos = data;
      },
      err => {
        console.log(err);
      }
    );
  }

}
