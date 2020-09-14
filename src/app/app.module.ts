import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './system/registration/registration.component';

import { SidebarComponent } from './system/sidebar/sidebar.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { ProjectsComponent } from './projects/projects.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';


import { HttpClientModule } from '@angular/common/http/';
import { ServicesConfig } from './config/services.config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectsComponent } from './add-projects/add-projects.component';
import { JudgesComponent } from './judges/judges.component';
import { ProjectsRegisteredComponent } from './projects-registered/projects-registered.component';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JudgesRegisteredService } from './services/judges.service';

import { AddAdvisersComponent } from './add-advisers/add-advisers.component';
import { AdvisersRegisteredComponent } from './advisers-registered/advisers-registered.component';
import { AddAuthorsComponent } from './add-authors/add-authors.component';
import { AuthorsRegisteredComponent } from './authors-registered/authors-registered.component';
import { EstadisticsComponent } from './estadistics/estadistics.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    ProjectsComponent,
    AddProjectsComponent,
    JudgesComponent,
    ProjectsRegisteredComponent,

    JudgesComponent,

    AddAdvisersComponent,
    AdvisersRegisteredComponent,
    AddAuthorsComponent,
    AuthorsRegisteredComponent,
    EstadisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [
    ServicesConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
