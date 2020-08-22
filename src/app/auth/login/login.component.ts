import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
      var proyecto={
      Id_proyecto:1,
      Descripcion:"Hola",
      Nombre:"Tempis"
    }
      console.log(proyecto.Descripcion);
  }

}
