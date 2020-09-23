import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JuecesService } from '../../services/jueces.service';
import { ServicesConfig } from '../../config/services.config';
import { RouterLinkActive, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formLoginJudge: FormGroup;
  constructor(public formBuilder: FormBuilder,
              private juecesService: JuecesService,
              private router: Router,
              private _utilService:UtilsService) {

    this.formLoginJudge = formBuilder.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { }

  iniciarSesion() {
    this._utilService.loading = true;
    console.log(this.formLoginJudge.value);
    this.juecesService.iniciarSesionJuez(this.formLoginJudge.value).subscribe(
      data => {
        if (data) {
          this.router.navigateByUrl('home');
          console.log(data);
          localStorage.setItem('session', JSON.stringify(data));
        } else {
          swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario y/o contraseña incorrectos'
          });
        }
      },
      err => console.log(err)
    ).add(() => {
      this._utilService.loading = false;
    });
  }

}
