import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Importamos tu AuthService

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // --- ¡AQUÍ ESTÁ LA MAGIA! ---
  // Esta es la IP que obtuviste en el "Paso 1A" del PC del backend.
  // Reemplaza '192.168.1.10' con la IP de tu PC 2.
  // CAMBIO: Actualizado al puerto 5000 de tu .env
  private baseUrl = 'http://192.168.4.217:/api';
  // -----------------------------

  constructor(private http: HttpClient, private authService: AuthService) { }

  // --- Lógica de Login ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        // Si el login es exitoso (asumimos que el backend devuelve un token o un ok)
        console.log('Respuesta del backend:', response);

        // Opcional: guardar el token de respuesta en localStorage
        // localStorage.setItem('token', response.token);

        // Usamos tu AuthService para marcar al usuario como logueado
        this.authService.login();
      })
    );
  }

  // --- Lógica de Registro ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  // ... Aquí puedes añadir el resto de tus métodos (search, reports, etc.)
}
