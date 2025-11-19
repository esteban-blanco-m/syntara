import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../auth.service';
import {SearchResult} from '../search.service';
import {ApiService} from '../api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Variables del formulario
  searchQuery: string = '';
  quantity: number | null = 1;
  measure: string = ''; // -> se mapea a 'unit'

  // Variables de estado y resultados
  lastSearchQuery: string = '';
  lastSearchQuantity: number = 1;
  lastSearchMeasure: string = '';
  hasSearched: boolean = false;
  isLoading: boolean = false;
  results: (SearchResult & { measureLabel: string })[] = [];

  // Variables de error
  productError: string | null = null;
  measureError: string | null = null;
  generalError: string | null = null; // Para errores de API
  greetingName: string = '';

  // Inyectar SearchService
  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.name) {
        this.greetingName = `${user.name}`;
      } else {
        this.greetingName = '';
      }
    });
  }

  // src/app/home/home.component.ts

// ... (resto del código del componente)

  onSearch() {
    // Limpiar todos los errores al iniciar
    this.productError = null;
    this.measureError = null;
    this.generalError = null;
    this.results = [];

    // Validaciones
    if (!this.searchQuery.trim()) {
      this.productError = 'Escribe un producto.';
    }
    if (!this.measure || this.measure === '') {
      this.measureError = 'Selecciona una unidad.';
    }
    if (this.productError || this.measureError) {
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    this.lastSearchQuery = this.searchQuery;
    this.lastSearchQuantity = this.quantity || 1;
    this.lastSearchMeasure = this.measure;
    this.apiService.searchProducts(
      this.lastSearchQuery,
      this.lastSearchQuantity,
      this.lastSearchMeasure
    ).subscribe({
      next: (response: any) => {
        // --- INICIO DE LA CORRECCIÓN CRÍTICA ---
        // 1. Determinar el payload: response.data o la respuesta completa (response).
        const payload = response.data || response;

        // 2. Extraer el array de resultados, usando un array vacío como fallback.
        // Esto previene el error .map() en objetos nulos o indefinidos.
        const resultsArray = payload.results || [];

        const shortMeasure = this.getMeasureAbbreviation(this.lastSearchMeasure);

        // 3. Mapear sobre el array de resultados (resultsArray), que ahora está garantizado como un array.
        this.results = resultsArray.map((result: any) => ({
          ...result,
          measureLabel: shortMeasure
        }));
        // --- FIN DE LA CORRECCIÓN CRÍTICA ---

        // Ordenamos por precio
        this.results.sort((a, b) => a.price - b.price);
        // Limpiamos solo los campos principales del formulario
        this.searchQuery = '';
        this.quantity = 1;
        this.measure = '';

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error en la búsqueda:', err);
        this.generalError = 'Error al conectar con el backend. (¿Interceptor y token OK?)';
        this.isLoading = false;
      }
    });
  }

// ... (el resto del componente)

  private getMeasureAbbreviation(fullMeasure: string): string {
    const map: { [key: string]: string } = {
      'unidades': 'und', 'pares': 'par', 'docenas': 'doc', 'cajas': 'caja',
      'paquetes': 'paq', 'bolsas': 'bolsa', 'kits': 'kit', 'kilogramos': 'kg',
      'gramos': 'g', 'libras': 'lb', 'arrobas': 'arroba', 'quintales': 'qq',
      'bultos': 'bulto', 'litros': 'L', 'mililitros': 'ml', 'galones': 'gal',
      'metros': 'm', 'centimetros': 'cm', 'metros_cuadrados': 'm²'
    };
    return map[fullMeasure] || fullMeasure;
  }
}
