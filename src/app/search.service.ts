import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

// Interfaz para los datos que enviaremos al backend
// Basado en searchController.js

export interface SearchData {
  product: string;
  quantity: number;
  unit: string;
  stores: string[]; // El backend espera un array de strings
  category: string;
}

// Interfaz para la respuesta que esperamos del backend
// Basado en openaiService.js
export interface SearchResult {
  product: string;
  store: string;
  price: number;
  unitPrice: number | null;
  currency: "COP";
  url: string | null;
  date: string;
  confidence: number;
}


@Injectable({
  providedIn: 'root'

})

export class SearchService {
  // Usamos la misma IP de tu AuthService
  // y le añadimos la ruta de búsqueda
  private apiUrl = 'http://192.168.4.217:3000/api/search';

  constructor(private http: HttpClient) {
  }
  /**
   * Llama al endpoint POST /api/search del backend
   * El interceptor se encargará de añadir el token.
   */
  search(data: SearchData): Observable<{ results: SearchResult[] }> {
    return this.http.post<{ results: SearchResult[] }>(this.apiUrl, data);
  }
}
