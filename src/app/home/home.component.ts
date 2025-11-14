import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../auth.service';
// 1. Importar el servicio de búsqueda y las interfaces
// Se eliminó SearchData de la importación ya que no es necesaria en el componente
import { SearchService, SearchResult } from '../search.service';
// 💡 Importamos ApiService para usarlo como el verdadero proveedor de búsqueda
import { ApiService } from '../api.service'; // Asegúrate de que esta importación exista

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // --- Variables del formulario (Inputs) ---
  searchQuery: string = '';
  quantity: number | null = 1;
  measure: string = ''; // -> se mapea a 'unit'
  // ELIMINADO: category y stores (variables que ya no se usan)

  // --- Variables de estado y resultados ---
  // (Conservan el valor de la búsqueda aunque se limpie el input)
  lastSearchQuery: string = '';
  lastSearchQuantity: number = 1;
  lastSearchMeasure: string = '';
  // ELIMINADO: lastSearchCategory, lastSearchStores

  hasSearched: boolean = false;
  isLoading: boolean = false;
  // 3. Tipamos 'results' con la interfaz correcta
  results: (SearchResult & { measureLabel: string })[] = []; // Añadimos 'measureLabel' a la interfaz

  // --- Variables de Error ---
  productError: string | null = null;
  measureError: string | null = null;
  // ELIMINADO: categoryError, storesError
  generalError: string | null = null; // Para errores de API

  greetingName: string = '';

  // 4. Inyectar SearchService
  constructor(
    private authService: AuthService,
    // 💡 CORRECCIÓN: Inyectamos ApiService, que es donde definimos searchProducts
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.name) {
        // CORREGIDO: Uso correcto de template literal y eliminación de la coma extra
        this.greetingName = `${user.name}`;
      } else {
        this.greetingName = '';
      }
    });
  }

  onSearch() {
    // 5. Limpiar todos los errores al iniciar
    this.productError = null;
    this.measureError = null;
    this.generalError = null;
    this.results = [];

    // --- Validaciones ---
    if (!this.searchQuery.trim()) {
      this.productError = 'Escribe un producto.';
    }
    if (!this.measure || this.measure === '') {
      this.measureError = 'Selecciona una unidad.';
    }

    // Si existe CUALQUIER error, nos detenemos.
    if (this.productError || this.measureError) {
      return;
    }

    // --- Preparar llamada ---
    this.isLoading = true;
    this.hasSearched = true;

    // 1. Guardamos solo los campos que vamos a usar
    this.lastSearchQuery = this.searchQuery;
    this.lastSearchQuantity = this.quantity || 1;
    this.lastSearchMeasure = this.measure;

    // 🛑 CORRECCIÓN CLAVE: Llamamos al método searchProducts en el ApiService inyectado.
    this.apiService.searchProducts(
      this.lastSearchQuery,
      this.lastSearchQuantity,
      this.lastSearchMeasure
    ).subscribe({
      // 💡 CORRECCIÓN TS7006: Añadimos el tipado explícito 'response: any'
      next: (response: any) => {
        const shortMeasure = this.getMeasureAbbreviation(this.lastSearchMeasure);

        // 4. Mapeamos la respuesta para añadir 'measureLabel' que el HTML espera
        // Aquí puedes revisar si el backend te devuelve el array en 'response' o en 'response.data'
        this.results = (response.data || response).map( (result: any) => ({
          ...result,
          measureLabel: shortMeasure
        }));

        // Ordenamos por precio
        this.results.sort((a, b) => a.price - b.price);

        // 5. Limpiamos solo los campos principales del formulario
        this.searchQuery = '';
        this.quantity = 1;
        this.measure = '';

        this.isLoading = false;
      },
      // 💡 CORRECCIÓN TS7006: Añadimos el tipado explícito 'err: any'
      error: (err: any) => {
        console.error('Error en la búsqueda:', err);
        this.generalError = 'Error al conectar con el backend. (¿Interceptor y token OK?)';
        this.isLoading = false;
      }
    });
  }

  // No se borra: Esta función la necesitamos para mapear la respuesta
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
