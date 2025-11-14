// src/app/api.service.ts

import { Injectable } from '@angular/core';
// Importamos HttpParams junto a HttpClient
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService, User } from './auth.service'; // 💡 IMPORTANTE: Importamos también 'User'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Esta es la URL de tu backend
  private baseUrl = 'http://10.195.23.48:3000/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // --- Lógica de Login ---
  login(credentials: any): Observable<any> {
    // 💡 CORRECCIÓN TS2355: Aseguramos el uso de backticks (``) para el template literal
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        // Si el login es exitoso
        console.log('Respuesta del backend:', response);

        // 💡 2. CORRECCIÓN: Creamos el objeto 'User' completo
        // Basado en la interfaz de auth.service.ts y la respuesta del backend
        if (response && response.token && response.user) {
          const userToSave: User = {
            id: response.user.id,
            name: response.user.name,
            lastname: response.user.lastname,
            email: response.user.email,
            role: response.user.role,
            isSubscribed: response.user.isSubscribed || false // Asumimos false si no viene
          };

          // 3. 💡 CORRECCIÓN: Pasamos el 'user' y el 'token' al AuthService
          this.authService.login(userToSave, response.token);
        } else {
          console.error('Respuesta de login inválida:', response);
        }
      })
    );
  }

  // --- Lógica de Registro ---
  register(userData: any): Observable<any> {
    // 💡 CORRECCIÓN TS2355: Aseguramos el uso de backticks (``) para el template literal
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  // --- MÉTODO DE BÚSQUEDA CORREGIDO ---
  // Recibe solo los parámetros que el backend ahora espera (product, quantity, unit)
  searchProducts(product: string, quantity: number | null, unit: string): Observable<any[]> {

    // Construye los parámetros de la URL
    let params = new HttpParams();

    // Aseguramos que solo se añadan si tienen valor y que los nombres coincidan con el backend (req.query)
    if (product) {
      params = params.append('product', product);
    }
    // La cantidad (number) debe convertirse a string para HttpParams
    if (quantity !== null && quantity !== undefined) {
      params = params.append('quantity', quantity.toString());
    }
    if (unit) {
      params = params.append('unit', unit);
    }

    // Eliminamos la lógica de 'location' y 'stores'

    // Realiza la llamada GET a la ruta de búsqueda
    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  // ... Aquí puedes añadir el resto de tus métodos (reports, etc.)
}
