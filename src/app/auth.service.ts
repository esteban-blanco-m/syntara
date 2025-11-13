// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// 1. Definimos la interfaz para saber qué datos tiene el usuario
export interface User {
  id?: string;
  name: string;          // Para el saludo en el Home
  email: string;
  isSubscribed: boolean; // Para ocultar el botón de suscripción
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 2. Ahora guardamos el OBJETO de usuario completo o null (si no hay sesión)
  private _currentUser = new BehaviorSubject<User | null>(null);

  // Observable para que los componentes (Home, App) escuchen los cambios
  currentUser$ = this._currentUser.asObservable();

  constructor() {
    // 3. Al cargar la app, revisamos si ya hay un usuario guardado en el navegador
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this._currentUser.next(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error al recuperar sesión:', e);
        this._currentUser.next(null);
      }
    }
  }

  // Método auxiliar para obtener el valor actual sin suscribirse
  getCurrentUser(): User | null {
    return this._currentUser.getValue();
  }

  // Modificado: Retorna true si existe un usuario, false si es null
  isLoggedIn(): boolean {
    return !!this._currentUser.getValue();
  }

  // 4. Login ahora RECIBE los datos del usuario
  login(userData: User) {
    this._currentUser.next(userData); // Actualiza el estado en memoria
    localStorage.setItem('user', JSON.stringify(userData)); // Guarda en el navegador
  }

  // 5. Logout limpia todo
  logout() {
    this._currentUser.next(null);
    localStorage.removeItem('user');
  }
}
