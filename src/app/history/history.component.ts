import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {ApiService} from '../api.service';

// Interfaz para el historial
export interface HistoryItem {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  date: Date;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  // Variables de estado
  searchHistory: HistoryItem[] = [];
  isLoadingHistory: boolean = false;
  historyError: string | null = null;

  // Inyectar ApiService y Router
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
  }

  ngOnInit() {
    // Llamada a cargar el histotial
    this.fetchHistory();
  }

  fetchHistory() {
    this.isLoadingHistory = true;
    this.historyError = null;
    this.searchHistory = [];

    // Llamada al nuevo metodo del ApiService
    this.apiService.getSearchHistory().subscribe({

      // Manejo de éxito
      next: (response: any) => {
        this.searchHistory = (response.data || response) as HistoryItem[];
        this.searchHistory.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.isLoadingHistory = false;
      },

      // Manejo de error
      error: (err: any) => {
        console.error('Error al cargar el historial:', err);
        this.historyError = 'No se pudo cargar tu historial. Intenta de nuevo más tarde.';
        this.isLoadingHistory = false;
      }
    });
  }

  //Navega de nuevo a la busqueda
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
