import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import * as dayjs from 'dayjs';

import { Globales } from 'src/app/services/Globales.service';
import { tiposService } from 'src/app/services/tipos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'contratoRegistro',
  templateUrl: './contratoRegistro.component.html',
  styleUrls: ['./contratoRegistro.component.css']
})
export class ContratoRegistroComponent implements OnInit {

  idContrato: string;
  path_create_update: string;
  registroForm: FormGroup;
  arrSelectTipoContrato: any[];
  arrInmuebles: any[];
  arrTipoPeriodo: any[];
  sesionStorageAdministradorId: number;

  constructor(
    private metodosGlobales: Globales,
    private metodosTipos: tiposService,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {
    this.idContrato = ""
    this.arrSelectTipoContrato = [];
    this.arrInmuebles = [];
    this.arrTipoPeriodo = [];
    this.registroForm = new FormGroup({
      idContratos: new FormControl(),
      fechaContrato: new FormControl(new Date(), [
        Validators.required]),
      valorContrato: new FormControl('', [
        Validators.required]),
      fechaInicio: new FormControl(new Date(), [
        Validators.required]),
      fechaFin: new FormControl(),
      cantidadPeriodo: new FormControl(1),


      inmuebleId: new FormControl(),
      tipoPeriodoId: new FormControl('', [
        Validators.required]),
      tipoContratoId: new FormControl('', [
        Validators.required]),


      administradorId: new FormControl(parseInt(sessionStorage.getItem('administradorId')!)),
      usuarioId: new FormControl(parseInt(sessionStorage.getItem('idUsuario')!)),
      borrado: new FormControl(false),
      createTime: new FormControl(),
      updateTime: new FormControl(),
    },
      { validators: [this.validacionFechaPago] });
  }

  async ngOnInit() {
    this.arrInmuebles = await this.metodosGlobales.getAll(environment.APIPATH_INMUEBLE + parseInt(sessionStorage.getItem('administradorId')!));
    this.arrSelectTipoContrato = await this.metodosTipos.getAllTipos(environment.APIPATH_TIPOCONTRATO + parseInt(sessionStorage.getItem('administradorId')!));
    this.arrTipoPeriodo = await this.metodosTipos.getAllTipos(environment.APIPATH_TIPOPERIODO + parseInt(sessionStorage.getItem('administradorId')!))
    this.activateRouter.params.subscribe(async params => {
      if (params['id']) {
        let response = await this.metodosGlobales.getById(environment.APIPATH_CONTRATODETALLE, params['id'])
        response[0].fechaContrato = dayjs(response[0].fechaContrato).format('YYYY-MM-DD')
        response[0].fechaInicio = dayjs(response[0].fechaInicio).format('YYYY-MM-DD')
        response[0].fechaFin = dayjs(response[0].fechaFin).format('YYYY-MM-DD')
        this.registroForm.patchValue(response[0])
      }

    })
  }
  async enviar() {
    if (this.registroForm.value.idContratos !== null) {
      this.registroForm.value.updateTime = new Date();
      await this.metodosGlobales.update(this.registroForm.value, environment.APIPATH_CONTRATO);
    } else {
      this.registroForm.value.createTime = new Date();
      this.registroForm.value.updateTime = new Date();
      await this.metodosGlobales.create(this.registroForm.value, environment.APIPATH_CONTRATO);
    }
    window.location.reload();
  }

  validacionFechaPago(formulario: FormGroup): ValidationErrors | null {
    let fechaInicio = formulario.get("fechaInicio").value
    let fechaFin = formulario.get("fechaFin").value
    let result
    if (fechaFin) {
      result = (fechaInicio > fechaFin) ? { validacionFechaPago: true } : null
    } else {
      result = null
    }
    return result
  }

  checkError(fieldName: string, errorType: string) {
    return this.registroForm.get(fieldName).hasError(errorType) && this.registroForm.get(fieldName).touched
  }

  checkErrorForm(fieldName: string, errorType: string) {
    return this.registroForm.hasError(errorType) && this.registroForm.get(fieldName).touched
  }

}
