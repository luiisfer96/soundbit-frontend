import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';


import { AuthResponse, Usuario } from '../interfaces/interfaces';

import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario };
  }


  constructor( private http: HttpClient ) { }

  registro( nombre: string, correo: string, password: string ) {

    const url  = `${ this.baseUrl }/usuarios`;
    const body = { correo, password, nombre, rol: "USER_ROLE" };

    localStorage.setItem('correo', correo! );
    localStorage.setItem('contraseña', password! );

    return this.http.post<AuthResponse>( url, body )
      .pipe(
        tap( ({ token }) => {
          if ( token ) {
            localStorage.setItem('token', token! );
          }
        }),
        map( resp => resp.usuario),
        catchError( err => of(err.error.msg) )
      );

  }



  login( correo: string, password: string ) {

    const url  = `${ this.baseUrl }/auth/login`;
    const body = { correo, password };

    localStorage.setItem('correo', correo! );
    localStorage.setItem('contraseña', password! );

    return this.http.post<AuthResponse>( url, body )
      .pipe(
        tap( resp => {
          if ( resp.token ) {
            localStorage.setItem('token', resp.token! );
          }
        }),
        map( resp => resp.usuario),
        catchError( err => of(err.error.msg) )
      );
  }




  validarToken(): Observable<boolean> {
    const url  = `${ this.baseUrl }/auth/login`;
    const body = { correo: localStorage.getItem('correo'),
                   password: localStorage.getItem('contraseña') };

    //console.log(body);

    /* const url = `${ this.baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '' ); */

    return this.http.post<AuthResponse>( url, body )
        .pipe(
          map( resp => {
            localStorage.setItem('token', resp.token! );
            this._usuario = {
              nombre: resp.usuario.nombre!,
              uid: resp.usuario.uid!,
              correo: resp.usuario.correo!
            }

            return true;
          }),
          catchError( err => of(false) )
        );

  }

  logout() {
    localStorage.clear();
  }


}
