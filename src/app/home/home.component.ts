import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  // Variables del formulario (Inputs)
  searchQuery: string = '';
  quantity: number | null = 1; // Permitir null para limpiar
  measure: string = '';

  // 💡 VARIABLES NUEVAS: Para mostrar en el título de resultados
  // (Conservan el valor de la búsqueda aunque se limpie el input)
  lastSearchQuery: string = '';
  lastSearchQuantity: number = 1;
  lastSearchMeasure: string = '';

  hasSearched: boolean = false;
  isLoading: boolean = false;
  searchError: string | null = null;
  results: any[] = [];

  onSearch() {
    this.searchError = null;

    if (!this.searchQuery.trim()) {
      this.searchError = 'Por favor, escribe el nombre de un producto.';
      return;
    }

    if (!this.measure || this.measure === '') {
      this.searchError = 'Debes seleccionar una unidad de medida.';
      return;
    }

    // 1. Guardamos lo que se buscó para mostrarlo en el título
    this.lastSearchQuery = this.searchQuery;
    this.lastSearchQuantity = this.quantity || 1;
    this.lastSearchMeasure = this.measure;

    this.hasSearched = true;
    this.isLoading = true;
    this.results = [];

    // 2. 💡 LIMPIAMOS EL FORMULARIO INMEDIATAMENTE
    this.searchQuery = '';
    this.quantity = 1;
    this.measure = '';

    setTimeout(() => {
      this.generateMockData();
      this.isLoading = false;
    }, 1500);
  }

  generateMockData() {
    const tiendas = ['Éxito', 'Olímpica', 'Ara', 'D1', 'Jumbo', 'Carulla'];
    const basePrice = Math.floor(Math.random() * 10000) + 2000;

    // Usamos la medida GUARDADA (lastSearchMeasure)
    const shortMeasure = this.getMeasureAbbreviation(this.lastSearchMeasure);

    this.results = tiendas
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map(tienda => {
        const randomVariation = (Math.random() * 2000) - 1000;
        const finalPrice = Math.abs(Math.floor(basePrice + randomVariation));

        return {
          store: tienda,
          price: finalPrice,
          // Usamos la cantidad GUARDADA (lastSearchQuantity)
          unitPrice: Math.floor(finalPrice / (this.lastSearchQuantity || 1)),
          measureLabel: shortMeasure,
          currency: 'COP',
          url: 'https://www.google.com',
          // Usamos el producto GUARDADO
          product: this.lastSearchQuery
        };
      })
      .sort((a, b) => a.price - b.price);
  }

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
