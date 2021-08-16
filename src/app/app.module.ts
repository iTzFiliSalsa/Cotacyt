import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './system/registration/registration.component';

import { SidebarComponent } from './system/sidebar/sidebar.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { ProjectsComponent } from './Components/Projects/projects/projects.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';


import { HttpClientModule } from '@angular/common/http/';
import { ServicesConfig } from './config/services.config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JudgesComponent } from './Components/Judges/judges/judges.component';
import { ProjectsRegisteredComponent } from './Components/Projects/projects-registered/projects-registered.component';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JudgesRegisteredService } from './services/judges.service';

import { AdvisersRegisteredComponent } from './Components/Advisers/advisers-registered/advisers-registered.component';
import { AuthorsRegisteredComponent } from './Components/Authors/authors-registered/authors-registered.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EstadisticsComponent } from './estadistics/estadistics.component';

import { TitleCasePipe } from '@angular/common';
import { GraForSGComponent } from './Graphics/gra-for-sg/gra-for-sg.component';
import { GraForCatComponent } from './Graphics/gra-for-cat/gra-for-cat.component';
import { GraForAseComponent } from './Graphics/gra-for-ase/gra-for-ase.component';
import { GraForPartComponent } from './Graphics/gra-for-part/gra-for-part.component';
import { GraForProyComponent } from './Graphics/gra-for-proy/gra-for-proy.component';


@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    ProjectsComponent,
    JudgesComponent,
    ProjectsRegisteredComponent,
    JudgesComponent,
    AdvisersRegisteredComponent,
    AuthorsRegisteredComponent,
    EstadisticsComponent,
    GraForSGComponent,
    GraForCatComponent,
    GraForAseComponent,
    GraForPartComponent,
    GraForProyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule,
    SweetAlert2Module.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    ServicesConfig,
    TitleCasePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
