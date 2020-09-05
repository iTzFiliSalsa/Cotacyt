import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JuecesService } from '../../services/jueces.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public isCollapsed = false;

  public formsRegistroJuez: FormGroup;
  constructor(public formBuilder: FormBuilder, private juecesService: JuecesService) {
    this.formsRegistroJuez = formBuilder.group({
      id_categorias: [1, [Validators.required]],
      usuario: ['', [Validators.required, Validators.maxLength(30)]],
      contrasena: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
  }
  registrarJuez() {
    console.log(this.formsRegistroJuez.value);
    this.juecesService.registrarJuez( this.formsRegistroJuez.value ).subscribe(
    data => {
      alert(data);
      this.formsRegistroJuez.reset();
    },
    err => console.log( err )
    );
  }

}
