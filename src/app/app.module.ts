import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './system/registration/registration.component';

import { SidebarComponent } from './system/sidebar/sidebar.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { HttpClientModule } from '@angular/common/http/';
import { ServicesConfig } from './config/services.config';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ServicesConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
