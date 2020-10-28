import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesConfig } from '../config/services.config';
import { Session } from '../models/session.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalificarProyectoService {

  sessionData: Session;
  constructor(private http: HttpClient, private servicesConfig: ServicesConfig) {
    this.sessionData = JSON.parse(localStorage.getItem('session'));
  }

  getCalificaciones(categoria: string, idProyecto: number): Observable<any> {
    switch ( categoria ) {
      case 'petit':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/pioneros-petit'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'kids':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/pioneros-kids'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'juvenil':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/pioneros-juvenil'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'media superior':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/media-superior'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'superior':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/superior'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'posgrado':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/posgrado'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
    }
  }

  getCalificacionesEstatales(categoria: string, idProyecto: number): Observable<any> {
    switch ( categoria ) {
      case 'petit':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/pioneros-petit-estatal'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'kids':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/pioneros-kids-estatal'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'juvenil':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/pioneros-juvenil-estatal'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'media superior':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/media-superior-estatal'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'superior':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/superior-estatal'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'posgrado':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/posgrado-estatal'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
    }
  }

  getCalificacionesInternacionales(categoria: string, idProyecto: number): Observable<any> {
    switch ( categoria ) {
      case 'media superior':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/media-superior-internacional'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
      case 'superior':
        return this.http.get(this.servicesConfig.APP_ENDPOINT
          + 'api/superior-internacional'
          + '?id_proyectos='
          + idProyecto + '&id_jueces='
          + this.sessionData.id_jueces
        );
    }
  }

  setCalificacionesPetit(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-petit/nuevo', body);
  }

  setCalificacionesKids(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-kids/nuevo', body);
  }

  setCalificacionesJvenil(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-juvenil/nuevo', body);
  }

  setCalificacionesMediaSuperior(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/media-superior/nuevo', body);
  }

  setCalificacionesSuperior(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/superior/nuevo', body);
  }

  setCalificacionesPosgrado(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/posgrado/nuevo', body);
  }

  putCalificacionesPetit(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-petit/modificar', body);
  }

  putCalificacionesKids(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-kids/modificar', body);
  }

  putCalificacionesJvenil(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-juvenil/modificar', body);
  }

  putCalificacionesMediaSuperior(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number,
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/media-superior/modificar', body);
  }

  putCalificacionesSuperior(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/superior/modificar', body);
  }

  putCalificacionesPosgrado(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/posgrado/modificar', body);
  }
  //#region SetCalificacionesEstatal
  setCalificacionesPetitEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-petit-estatal/nuevo', body);
  }

  setCalificacionesKidsEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-kids-estatal/nuevo', body);
  }

  setCalificacionesJvenilEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-juvenil-estatal/nuevo', body);
  }

  setCalificacionesMediaSuperiorEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/media-superior-estatal/nuevo', body);
  }

  setCalificacionesSuperiorEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/superior-estatal/nuevo', body);
  }

  setCalificacionesPosgradoEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/posgrado-estatal/nuevo', body);
  }
  //#endregion

  //#region PutCalificacionesEstatal
  putCalificacionesPetitEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-petit-estatal/modificar', body);
  }

  putCalificacionesKidsEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-kids-estatal/modificar', body);
  }

  putCalificacionesJvenilEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/pioneros-juvenil-estatal/modificar', body);
  }

  putCalificacionesMediaSuperiorEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number,
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/media-superior-estatal/modificar', body);
  }

  putCalificacionesSuperiorEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/superior-estatal/modificar', body);
  }

  putCalificacionesPosgradoEstatal(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/posgrado-estatal/modificar', body);
  }
  //#endregion

  //#region SetCalificacionesInternacional
  setCalificacionesMediaSuperiorInternacional(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/media-superior-internacional/nuevo', body);
  }

  setCalificacionesSuperiorInternacional(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.post(this.servicesConfig.APP_ENDPOINT + 'api/superior-internacional/nuevo', body);
  }
  //#endregion

  //#region PutCalificacionesInternacional
  putCalificacionesMediaSuperiorInternacional(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number,
    ): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/media-superior-internacional/modificar', body);
  }

  putCalificacionesSuperiorInternacional(
    idProyecto: number,
    obtenido1: number,
    obtenido2: number,
    obtenido3: number,
    obtenido4: number,
    obtenido5: number,
    obtenido6: number,
    obtenido7: number,
    obtenido8: number): Observable<any> {
    const body = {
      id_proyectos: idProyecto,
      id_jueces: this.sessionData.id_jueces,
      obtenido1,
      obtenido2,
      obtenido3,
      obtenido4,
      obtenido5,
      obtenido6,
      obtenido7,
      obtenido8
    };
    return this.http.put(this.servicesConfig.APP_ENDPOINT + 'api/superior-internacional/modificar', body);
  }
  //#endregion
}
