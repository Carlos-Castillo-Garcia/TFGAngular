import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Globales } from 'src/app/services/Globales.service';
import { tiposService } from 'src/app/services/tipos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'intervinienteRegistro',
  templateUrl: './intervinienteRegistro.component.html',
  styleUrls: ['./intervinienteRegistro.component.css']
})
export class IntervinienteRegistroComponent implements OnInit {

  //Variables Generales
  registroForm: FormGroup;
  sesionStorageAdministradorId: number;

  //Listas
  arrInmuebles: any[];
  arrTipoInterviniente: any[];
  arrCliente: any[];

  constructor(
    private metodosGlobales: Globales,
    private metodosTipos: tiposService,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {

    this.arrInmuebles = [];
    this.arrTipoInterviniente = [];
    this.arrCliente = [];

    this.registroForm = new FormGroup({
      idInterviniente: new FormControl(),
      porcentajePropiedad: new FormControl(0, [
        Validators.required,
        Validators.min(1)
      ]),

      clienteId: new FormControl('', [
        Validators.required
      ]),
      tipoIntervinienteId: new FormControl('', [
        Validators.required
      ]),
      contratosId: new FormControl(),

      administradorId: new FormControl(parseInt(sessionStorage.getItem('administradorId')!)),
      usuarioId: new FormControl(parseInt(sessionStorage.getItem('idUsuario')!)),
      borrado: new FormControl(false),
      createTime: new FormControl(),
      updateTime: new FormControl(),
    })
  }

  async ngOnInit() {
    this.arrCliente = await this.metodosGlobales.getAll(environment.APIPATH_CLIENTE + parseInt(sessionStorage.getItem('administradorId')!));
    this.arrInmuebles = await this.metodosGlobales.getAll(environment.APIPATH_INMUEBLE + parseInt(sessionStorage.getItem('administradorId')!));
    this.arrTipoInterviniente = await this.metodosTipos.getAllTipos(environment.APIPATH_TIPOINTERVINIENTE + parseInt(sessionStorage.getItem('administradorId')!));
    this.activateRouter.params.subscribe(async params => {
      if (params['idInterviniente']) {
        let response = await this.metodosGlobales.getById(environment.APIPATH_INTERVINIENTEDETALLE, params['idInterviniente'])
        this.registroForm.patchValue(response[0])
      }
    })
  }
  async enviar() {
    this.activateRouter.params.subscribe(async params => {
      if (this.registroForm.value.idInterviniente !== null) {
        this.registroForm.value.updateTime = new Date();
        await this.metodosGlobales.update(this.registroForm.value, environment.APIPATH_INTERVINIENTE);
      } else {
        this.registroForm.value.createTime = new Date();
        this.registroForm.value.updateTime = new Date();
        this.registroForm.value.contratosId = this.activateRouter.snapshot.params['id'];
        await this.metodosGlobales.create(this.registroForm.value, environment.APIPATH_INTERVINIENTE);
      }
      window.location.reload();
    })

  }

  checkError(fieldName: string, errorType: string) {
    return this.registroForm.get(fieldName).hasError(errorType) && this.registroForm.get(fieldName).touched
  }
}

