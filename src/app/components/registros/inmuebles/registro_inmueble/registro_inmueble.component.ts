//Genericos
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

//Propios
import { inmuebleInterface } from 'src/app/interfaces/inmuebles';
import { Globales } from 'src/app/services/Globales.service';

@Component({
  selector: 'app-registro_inmueble',
  templateUrl: './registro_inmueble.component.html',
  styleUrls: ['./registro_inmueble.component.css']
})
export class Registro_inmuebleComponent implements OnInit {

  registroForm: FormGroup;
  arrListaInmuebles: inmuebleInterface;
  path_lista: string;
  path_create_update: string;

  constructor(
    private metodosGlobales: Globales,
    private activateRouter: ActivatedRoute
  ) {
    this.path_lista = 'Inmuebles/detalle/'
    this.path_create_update = 'Inmuebles/'
    this.arrListaInmuebles = {
      idInmueble: 0,
      idTipoInmueble: 0,
      tipoInmueble: '',
      alias: '',
      refCatastral: '',
      localidad: '',
      direccion: '',
      codigoPostal: 0,
      usuario_id: 0,
      borrado: false,
      idAdministrador: 0,
    };
    this.registroForm = new FormGroup({
      idInmueble: new FormControl(),
      idTipoInmueble: new FormControl(),
      alias: new FormControl(),
      refCatastral: new FormControl(),
      localidad: new FormControl(),
      direccion: new FormControl(),
      codigoPostal: new FormControl(),
      idAdministrador: new FormControl(),
      borrado: new FormControl(),
    })
  }

  async ngOnInit() {
    this.activateRouter.params.subscribe(async params => {
      let response = await this.metodosGlobales.getById(this.path_lista, params['id'])
      this.registroForm.patchValue(response[0])
      this.registroForm.patchValue({ idTipoInmueble: response[0].idTipoInmueble.idTipoInmueble })
    })
  }
  async enviar() {
    if (this.registroForm.value.idInmueble != 0) {
      await this.metodosGlobales.update(this.registroForm.value, this.path_create_update);
    } else {
      await this.metodosGlobales.create(this.registroForm.value, this.path_create_update);
    }
  }
}
