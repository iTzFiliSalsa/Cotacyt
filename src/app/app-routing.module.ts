import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SidebarComponent } from './system/sidebar/sidebar.component';
import { RegistrationComponent } from './system/registration/registration.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectsComponent } from './add-projects/add-projects.component'
import { JudgesComponent } from './judges/judges.component'
import { ProjectsRegisteredComponent } from './projects-registered/projects-registered.component'
import { AddAdvisersComponent } from './add-advisers/add-advisers.component'
import { AdvisersRegisteredComponent } from './advisers-registered/advisers-registered.component'
import { AddAuthorsComponent } from './add-authors/add-authors.component'
import { AuthorsRegisteredComponent } from './authors-registered/authors-registered.component'


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'home', component: SidebarComponent, children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'judges', component: RegistrationComponent
      },
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
      },
      {
        path: 'projects', component: ProjectsComponent
      },
      {
        path: 'add-projects', component: AddProjectsComponent
      },

      {
        path: 'registered-judges', component: JudgesComponent
      },

      {
        path: 'projects-registered', component: ProjectsRegisteredComponent
      },
      {
        path: 'add-advisers', component: AddAdvisersComponent
      },
      {
        path: 'advisers-registered', component: AdvisersRegisteredComponent
      },
      {
        path: 'add-authors', component: AddAuthorsComponent
      },
      {
        path: 'authors-registered', component: AuthorsRegisteredComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    { useHash: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
