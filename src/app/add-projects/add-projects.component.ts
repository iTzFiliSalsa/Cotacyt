import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SedesService } from '../services/sedes.service';
import { AreasService } from '../services/areas.service';
import { AsesoresService } from '../services/asesores.service';
import { Areas } from '../models/areas.model';
import { Sedes } from '../models/sedes.model';
import { Asesores } from '../models/asesores.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriasService } from '../services/categorias.service';
import { Categorias } from '../models/categorias.model';
import { ProyectosService } from '../services/proyectos.service';
import { UtilsService } from '../services/utils.service';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Session } from '../models/session.model';
import Swal from 'sweetalert2';
import { DataService } from '../services/data.service';
import { Autores, AutoresSelect } from '../models/autores.model';
import { AutoresService } from '../services/autores.service';


@Component({
  selector: 'app-add-projects',
  templateUrl: './add-projects.component.html',
  styleUrls: ['./add-projects.component.scss']
})

export class AddProjectsComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  public files = [];
  @ViewChild('swalid') private Variable: SwalComponent;
  fileToUpload: File = null;
  areas: Areas[];
  sedes: Sedes[];
  asesores: Asesores[];
  categorias: Categorias[];
  autores: AutoresSelect[];
  autoresSeleccionados: any[];
  dropdownSettings: IDropdownSettings;
  formRegistroProyecto: FormGroup;
  datosExcel: [][];
  funciones = [];
  arreglo: any[];
  importes: any[];
  sessionData: Session;
  label: string = 'Sube un archivo...';
  constructor(
    public readonly swalTargets: SwalPortalTargets,
    private sedesService: SedesService,
    private areasService: AreasService,
    private asesoresService: AsesoresService,
    private categoriasServices: CategoriasService,
    private proyectosService: ProyectosService,
    private autoresService: AutoresService,
    private formBuilder: FormBuilder,
    private _utilService: UtilsService,
    private _dataService: DataService
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
    this.areas = new Array<Areas>();
    this.sedes = new Array<Sedes>();
    this.autoresSeleccionados = new Array<any>();
    this.arreglo = new Array<any>();
    this.asesores = new Array<Asesores>();
    this.autores = new Array<Autores>();
    this.importes = new Array<any>();
    this.categorias = new Array<Categorias>();
    this.formRegistroProyecto = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.max(50)]],
      id_asesores: ['1', [Validators.required]],
      id_sedes: this.sessionData.id_sedes,
      id_areas: ['1', [Validators.required]],
      id_categorias: ['1', [Validators.required]],
      ids_autores: ['', [Validators.required]],
      resumen: ['', [Validators.required, Validators.max(150)]]
    });
    this._utilService._loading = true;
  }

  ngOnInit(): void {
    forkJoin(
      {
        areas: this.areasService.getAreas(),
        sedes: this.sedesService.getSedes(),
        categorias: this.categoriasServices.getAllCategrias(),
        asesores: this.asesoresService.getAsesores(),
        autores: this.autoresService.getAutoresSelect(),
      }
    ).subscribe(
      data => {
        this.areas = data.areas;
        this.sedes = data.sedes;
        this.categorias = data.categorias;
        this.asesores = data.asesores;
        this.autores = data.autores;
      }, err => {
        console.log(err);
      }
    ).add(() => {
      this._utilService._loading = false;
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id_autores',
        textField: 'nombre',
        itemsShowLimit: 3,
        limitSelection: 3,
        allowSearchFilter: true
      };
    });
  }

  check(id) {
    this._utilService.loading = true;
    const fileUpload = this.fileUpload.nativeElement;
    var reader = new FileReader();
    reader.readAsBinaryString(fileUpload.files[0]);

    reader.onload = () => {

      const data = btoa(<string>reader.result);
      // console.log("La data es: ", data);

      this._dataService.putData(data, id).subscribe(
        res => {
          swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El proyecto se registró correctamente'
          });

          this.formRegistroProyecto.reset({
            id_sedes: this.sessionData.id_sedes
          });

        },
        err => {
          console.log(err);
        }
      ).add(() => {
        this._utilService.loading = false;
      })

    };
  }

  registrarProyecto() {
    // console.log(this.formRegistroProyecto.value);
    const fileUpload = this.fileUpload.nativeElement;
    if (!fileUpload.value) {
      Swal.fire({
        title: 'Error',
        text: 'Hace falta subir el video',
        icon: 'error'
      });
    } else {
      this._utilService.loading = true;
      this.proyectosService.postNuevoProyecto(this.formRegistroProyecto.value)
        .subscribe(
          data => {
            this.check(data);
          },
          err => {
            swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al registrar el proyecto'
            });
            console.log(err);
          }
        ).add(() => {
          this._utilService.loading = false;
        });
    }
  }
  onFileChange(evt: any) {
    const TARGET: DataTransfer = <DataTransfer>(evt.target);
    if (TARGET.files.length !== 1) {
      Swal.fire({
        title: 'No se puede subir mas de un archivo a la vez',
        icon: 'error'
      });
      TARGET.clearData(evt);
    }
    const READER: FileReader = new FileReader();
    READER.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.datosExcel = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.datosExcel.forEach((value: [], index) => {
        if (index > 3) {
          this.arreglo = value;
          const json = {
            // autores
            folio: this.arreglo[0],
            nombres1: this.arreglo[1],
            a_paterno1: this.arreglo[2],
            a_materno1: this.arreglo[3],
            telefono1: this.arreglo[4],
            email1: this.arreglo[5],
            localidad1: this.arreglo[6],
            municipio1: this.arreglo[7],
            escuela1: this.arreglo[8],
            facebook1: this.arreglo[9],
            twitter1: this.arreglo[10],
            nombres2: this.arreglo[11],
            a_paterno2: this.arreglo[12],
            a_materno2: this.arreglo[13],
            telefono2: this.arreglo[14],
            email2: this.arreglo[15],
            municipio2: this.arreglo[16],
            localidad2: this.arreglo[17],
            escuela2: this.arreglo[18],
            facebook2: this.arreglo[19],
            twitter2: this.arreglo[20],
            nombres3: this.arreglo[21],
            a_paterno3: this.arreglo[22],
            a_materno3: this.arreglo[23],
            telefono3: this.arreglo[24],
            email3: this.arreglo[25],
            municipio3: this.arreglo[26],
            localidad3: this.arreglo[27],
            escuela3: this.arreglo[28],
            facebook3: this.arreglo[29],
            twitter3: this.arreglo[30],
            // asesor
            nombre_asesor: this.arreglo[31],
            a_pat_asesor: this.arreglo[32],
            a_mat_asesor: this.arreglo[33],
            email_asesor: this.arreglo[34],
            descripcion_asesor: this.arreglo[35],
            // proyecto
            titulo_proyecto: this.arreglo[36],
            resumen_proyecto: this.arreglo[37],
            area_proyecto: this.arreglo[38],
            sede_proyecto: this.arreglo[39],
            categoria_proyecto: this.arreglo[40],
            status_proyecto: this.arreglo[41],
            ruta_proyecto: this.arreglo[42],
          };
          this.importes.push(json);
        }
      });
      this.Variable.fire();

    };
    READER.readAsBinaryString(TARGET.files[0]);
  }

  handleFileInput(files: FileList) {
    // this.fileToUpload = files.item(0);
    console.log(files[0].name);
    this.label = files[0].name;
  }

  guardarEnBD(evt: any) {
    let success;
    this.importes.forEach((value, index) => {
      this.proyectosService.importProyectoExcel(value)
        .subscribe(data => {
          success = true;
          if (index === this.importes.length - 1) {
            Swal.fire({
              title: 'se importo con exito',
              icon: 'success'
            });
          }
          console.log(data);
        }, err => {
          success = false;
          if (index === this.importes.length - 1) {
            Swal.fire({
              title: 'Ocurrio un error',
              icon: 'error'
            });
          }
          console.error(err);
        });
    });
  }

  addAutor(item) {
    this.autoresSeleccionados.push(item);
  }
  dropAutor(item) {
    this.autoresSeleccionados.map((res, index) => {
      if (res.id_autores === item.id_autores) {
        this.autoresSeleccionados.splice(index, 1);
      }
    });
  }
}
