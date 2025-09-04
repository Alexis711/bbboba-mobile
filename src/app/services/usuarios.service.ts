import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = environment.urlBase + 'usuarios/';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(
    private http: HttpClient
  ) { }

  getUsers(payload: any) {
    return this.http.get(
      `${this.url}todos`, 
      {
        headers: this.headers,
        params: payload,
      });
  }

  createUser(payload: any) {
    return this.http.post(
      `${this.url}crear`, 
      payload, 
      { 
        headers: this.headers
      }
    );
  }

  putUser(payload: any) {
    return this.http.put(
      `${this.url}editar`,
      payload, 
      {
        headers: this.headers
      }
  );
  }

  deleteUser(payload: any) {
    return this.http.put(
      `${this.url}eliminar`,
      payload, 
      {
        headers: this.headers,
      });
  }
}
