import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JuecesService } from '../../services/jueces.service';
import { ServicesConfig } from '../../config/services.config';
import { RouterLinkActive, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formLoginJudge: FormGroup;
  usaurios: [];
  constructor(public formBuilder: FormBuilder,
              private juecesService: JuecesService,
              private router: Router,
              private _utilService:UtilsService) {

    this.formLoginJudge = formBuilder.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.juecesService.getJueces().subscribe(
      data => this.usaurios = data,
      err => console.log(err));
  }
  
  iniciarSesion() {
    this._utilService.loading = true;
    console.log(this.formLoginJudge.value);
    this.juecesService.iniciarSesionJuez(this.formLoginJudge.value).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('home');
          localStorage.setItem('session', JSON.stringify(data));
        } else {
          alert('contraseña/correo incorrectas');
        }
      },
      err => console.log(err)
    ).add(() => {
      this._utilService.loading = false;
    });
  }

}
