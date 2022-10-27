import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import * as dayjs from 'dayjs'

import { Globales } from 'src/app/services/Globales.service';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';


@Component({
  selector: 'clienteRegistro',
  templateUrl: './clienteRegistro.component.html',
  styleUrls: ['./clienteRegistro.component.css'],
})
export class ClienteRegistroComponent implements OnInit {
  idCliente: string;
  registroForm: FormGroup;

  constructor(
    private metodosGlobales: Globales,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {
    this.idCliente = ""
    this.registroForm = new FormGroup({
      idCliente: new FormControl(),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
        Validators.minLength(3),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)
      ]),
      nie: new FormControl('', [
        Validators.required,
        this.dniValidators
      ]),
      fechaNacimiento: new FormControl('', [
        Validators.required]),
      tlf: new FormControl(),
      tlfMovil: new FormControl('', [
        Validators.required]),
      localidad: new FormControl('', [
        Validators.required]),
      direccion: new FormControl('', [
        Validators.required]),
      codigoPostal: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
      ]),
      administradorId: new FormControl(parseInt(sessionStorage.getItem('administradorId')!)),
      usuarioId: new FormControl(parseInt(sessionStorage.getItem('idUsuario')!)),
      borrado: new FormControl(),
      createTime: new FormControl(),
      updateTime: new FormControl(),
    })
  }
  async ngOnInit() {
    this.activateRouter.params.subscribe(async params => {
      if (params['id']) {
        let response = await this.metodosGlobales.getById(environment.APIPATH_CLIENTEDETALLE, params['id'])
        response[0].fechaNacimiento = dayjs(response[0].fechaNacimiento).format('YYYY-MM-DD')
        this.registroForm.patchValue(response[0])
      }
    })
  }
  async enviar() {
    if (this.registroForm.value.idInmueble !== null) {
      this.registroForm.value.updateTime = new Date();

      await this.metodosGlobales.update(this.registroForm.value, environment.APIPATH_CLIENTE);
    } else {
      this.registroForm.value.createTime = new Date();
      this.registroForm.value.updateTime = new Date();
      await this.metodosGlobales.create(this.registroForm.value, environment.APIPATH_CLIENTE);
    }
    window.location.reload();
  }
  checkError(fieldName: string, errorType: string) {
    return this.registroForm.get(fieldName).hasError(errorType) && this.registroForm.get(fieldName).touched
  }

  dniValidators(nie: FormControl) {
    // Ensure upcase and remove whitespace
    let str = nie.value;
    str = str.toUpperCase().replace(/\s/, '');
    let valid
    let type = '';

    let spainIdType = function (str: string) {
      const DNI_REGEX = /^(\d{8})([A-Z])$/;
      const CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
      const NIE_REGEX = /^[XYZ]\d{7,8}[A-Z]$/;
      if (str.match(DNI_REGEX)) {
        return 'dni';
      }
      if (str.match(CIF_REGEX)) {
        return 'cif';
      }
      if (str.match(NIE_REGEX)) {
        return 'nie';
      }
      return 'null';
    }

    let validDNI = function (dni: any) {
      const value = dni
      const grupoLetras = 'TRWAGMYFPDXBNJZSQVHLCKET';

      if (/^\d{8}[a-zA-Z]$/.test(value)) {
        const numero = value.substring(0, value.length - 1);
        const letra = value.substring(value.length - 1, value.length);
        const resto = numero % 23;
        const letraSeleccionada = grupoLetras.substring(resto, resto + 1);

        if (letraSeleccionada != letra.toUpperCase()) {
          return true;
        } else {
          return null;
        }
      } else {
        return true;
      }
    }

    let validNIE = function (dni: any) {
      let numero, temp, letra;
      const expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

      dni = dni.toUpperCase();

      if (expresion_regular_dni.test(dni) === true) {
        numero = dni.substr(0, dni.length - 1);
        numero = numero.replace('X', 0);
        numero = numero.replace('Y', 1);
        numero = numero.replace('Z', 2);
        temp = dni.substr(dni.length - 1, 1);
        numero = numero % 23;
        letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
        letra = letra.substring(numero, numero + 1);
        if (letra != temp) {
          //alert('Dni erroneo, la letra del NIF no se corresponde');
          return true;
        } else {
          //alert('Dni correcto');
          return null;
        }
      } else {
        //alert('Dni erroneo, formato no válido');
        return true;
      }

    }

    let validCIF = function (cif: any) {
      const CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
      if (!cif || cif.length !== 9) {
        return false;
      }

      let tempers = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      let digits = cif.substr(1, cif.length - 2);
      let temper = cif.substr(0, 1);
      let control = cif.substr(cif.length - 1);
      let sum = 0;
      let i = 0;
      let digit = 0;

      if (!temper.match(/[A-Z]/)) {
        return false;
      }

      for (i = 0; i < digits.length; ++i) {
        digit = parseInt(digits[i]);

        if (isNaN(digit)) {
          return false;
        }

        if (i % 2 === 0) {
          digit *= 2;
          if (digit > 9) {
            digit = (digit % 10) + (digit % 10);
          }

          sum += digit;
        } else {
          sum += digit;
        }
      }

      sum %= 10;
      if (sum !== 0) {
        digit = 10 - sum;
      } else {
        digit = sum;
      }

      if (temper.match(/[ABEH]/)) {
        return String(digit) === control;
      }
      if (temper.match(/[NPQRSW]/)) {
        return tempers[digit] === control;
      }

      return String(digit) === control || tempers[digit] === control;

    }
    if (str != '') {
      type = spainIdType(str);
      console.log(type)
      switch (type) {
        case 'dni':
          console.log(validDNI(str))
          if (validDNI(str)) {
            return { dnivalidators: true }
          } else {
            return null
          }
        case 'nie':
          if (validNIE(str)) {
            console.log(validNIE(str))
            return { dnivalidators: true }
          } else {
            return null
          }
        case 'cif':
          if (validCIF(str)) {
            console.log(validCIF(str))
            return { dnivalidators: true }
          } else {
            return null
          }
      }
    }
    return { dnivalidators: true }
  }
}
