import { Component, OnInit } from '@angular/core';
// 1. Importaciones necesarias
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
// 2. Importa el ApiService
import { ApiService } from '../api.service';

// 3. Interfaz para el historial (asegúrate que coincida con lo que devuelve tu API)
export interface HistoryItem {
  id: string; // O el tipo de ID que uses
  product: string;
  quantity: number;
  unit: string;
  date: Date; // O string, si la API devuelve un string
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  // 4. Variables de estado (igual que en HomeComponent)
  searchHistory: HistoryItem[] = [];
  isLoadingHistory: boolean = false;
  historyError: string | null = null;

  // 5. Inyecta ApiService y Router
  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    // 6. Llama al método para cargar el historial al iniciar
    this.fetchHistory();
  }

  /**
   * Llama al ApiService para obtener el historial.
   * (Esta es la lógica que imita a 'onSearch' de HomeComponent)
   */
  fetchHistory() {
    this.isLoadingHistory = true;
    this.historyError = null;
    this.searchHistory = [];

    // 7. Llama al nuevo método del ApiService
    this.apiService.getSearchHistory().subscribe({

      // 8. Manejo de éxito (next)
      next: (response: any) => {
        // Asignamos la respuesta (la API puede devolver 'response' o 'response.data')
        this.searchHistory = (response.data || response) as HistoryItem[];

        // Opcional: Ordenar por fecha más reciente
        this.searchHistory.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.isLoadingHistory = false;
      },

      // 9. Manejo de error (error)
      error: (err: any) => {
        console.error('Error al cargar el historial:', err);
        this.historyError = 'No se pudo cargar tu historial. Intenta de nuevo más tarde.';
        this.isLoadingHistory = false;
      }
    });
  }

  /**
   * Navega de vuelta al Home y pasa los parámetros de la búsqueda
   * para que el usuario pueda ejecutarla de nuevo.
   */
  onSearchAgain(item: HistoryItem) {
    this.router.navigate(['/'], {
      queryParams: {
        product: item.product,
        quantity: item.quantity,
        unit: item.unit
      }
    });
  }
}
