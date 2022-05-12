import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';

import { Globales } from 'src/app/services/Globales.service';
import { tiposService } from 'src/app/services/tipos.service';



@Component({
  selector: 'inmuebleLista',
  templateUrl: './inmuebleLista.component.html',
  styleUrls: ['./inmuebleLista.component.css'],
})
export class InmuebleListaComponent implements OnInit {

  inmuebleSeleccionadoId: number;
  path: string;
  //Formulario Modal
  arrSelectTipos: any[];

  //Tabla para la lista
  arrListaInmuebles: any[];

  constructor(
    private metodosGlobales: Globales,
    private metodosTipos: tiposService,
    private activateRouter: ActivatedRoute,
    private router: Router
  ) {

    this.path = 'inmuebles/';
    this.inmuebleSeleccionadoId = 1;

    //Tabla para la lista
    this.arrListaInmuebles = [];
    this.arrSelectTipos = [];

  }

  async ngOnInit() {
    this.arrSelectTipos = await this.metodosTipos.getAllTipos('inmuebles/1');
    this.arrListaInmuebles = await this.metodosGlobales.getById(this.path, 1);

    this.activateRouter.params.subscribe(params => {
      this.inmuebleSeleccionadoId = params['id']
    })

    for (const inmueble of this.arrListaInmuebles) {
      for (const tipos of this.arrSelectTipos) {
        if (tipos.idTipoInmueble == inmueble.idTipoInmueble) {
          inmueble.tipoInmueble = tipos.tipoInmueble;
        }
      }
    }
  }

  ngAfterViewInit() {
    
  }

  navegar(idInmueble: number) {
    this.router.navigate(["/inmuebles/detalle/" + idInmueble])
    
  }

}
