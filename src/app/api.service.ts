// src/app/api.service.ts

import { Injectable } from '@angular/core';
// 1. Importamos HttpParams junto a HttpClient
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Importamos tu AuthService

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Esta es la URL de tu backend
  private baseUrl = 'http://192.168.4.217:3000/api';

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

  // 2. --- MÉTODO DE BÚSQUEDA AÑADIDO ---
  // (Este método se comunica con searchController.js de sophiemjs)
  searchProducts(productName: string, location: string, stores: string): Observable<any[]> {

    // Construye los parámetros de la URL
    let params = new HttpParams();

    // Aseguramos que solo se añadan si tienen valor
    if (productName) {
      params = params.append('productName', productName);
    }
    if (location) {
      params = params.append('location', location);
    }
    if (stores) {
      params = params.append('stores', stores);
    }

    // Realiza la llamada GET a la ruta de búsqueda
    // (Asegúrate que la ruta '/search' exista en tus searchRoutes.js del backend)
    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  // ... Aquí puedes añadir el resto de tus métodos (reports, etc.)
}
