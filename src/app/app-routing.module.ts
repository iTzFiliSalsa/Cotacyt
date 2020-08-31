import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SidebarComponent } from './system/sidebar/sidebar.component';
import { RegistrationComponent } from './system/registration/registration.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';


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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
