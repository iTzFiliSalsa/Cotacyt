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

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ChartsModule
  ],
  providers: [
    ServicesConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
