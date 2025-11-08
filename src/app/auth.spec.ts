// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Importante para manejar estado

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Un BehaviorSubject mantiene el estado actual (true/false)
  // y notifica a cualquier componente que esté "escuchando".
  private loggedIn = new BehaviorSubject<boolean>(false);

  // Exponemos el estado como un "Observable" (solo de lectura)
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor() { }

  // Método para obtener el valor actual (para el Guard)
  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  // Método para iniciar sesión
  login() {
    // En una app real, aquí recibirías un token del backend.
    // Por ahora, solo cambiamos el estado a 'true'.
    this.loggedIn.next(true);
  }

  // Método para cerrar sesión
  logout() {
    this.loggedIn.next(false);
  }
}
