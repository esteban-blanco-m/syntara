// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Importante para manejar estado

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // CAMBIO: La variable interna debe llamarse _loggedIn (con guion bajo)
  // o el nombre que uses, y DEBE ser la misma que usas abajo.
  private _loggedIn = new BehaviorSubject<boolean>(false);

  // CAMBIO: Exponemos el observable usando el mismo nombre de la variable interna
  isLoggedIn$ = this._loggedIn.asObservable();

  constructor() { }

  // CAMBIO: Este es el método que usa el AuthGuard.
  // Dentro, debe usar la variable interna _loggedIn.
  isLoggedIn(): boolean {
    return this._loggedIn.getValue(); // CORREGIDO: Usamos _loggedIn
  }

  // Método para iniciar sesión
  login() {
    this._loggedIn.next(true); // CORREGIDO: Usamos _loggedIn
  }

  // Método para cerrar sesión
  logout() {
    this._loggedIn.next(false); // CORREGIDO: Usamos _loggedIn
  }
}
