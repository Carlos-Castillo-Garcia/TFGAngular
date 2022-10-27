import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class Globales {
  url: string = environment.APIPATH_GENERAL;
  //url: string = 'https://gestioninmuebles-spring.herokuapp.com/api/v1/'
  //url: string = 'http://localhost:8081/api/v1/';
  constructor(private httpClient: HttpClient) {
  }

  login(paramurl: string, email: string, password: string) {
    return firstValueFrom(this.httpClient.get<any>(this.url + paramurl + email + '/' + password))
  }
  getAll(paramurl: string) {
    return firstValueFrom(
      this.httpClient.get<any>(this.url + paramurl)
    );
  }
  getById(paramurl: string, pid: number) {
    return firstValueFrom(this.httpClient.get<any>(this.url + paramurl + pid))
  }
  create(formValue: any, paramurl: string) {
    return firstValueFrom(
      this.httpClient.post<any>(this.url + paramurl, formValue)
    );
  }
  update(formValue: any, paramurl: string) {
    return firstValueFrom(
      this.httpClient.put<any>(this.url + paramurl, formValue)
    );
  }
}
