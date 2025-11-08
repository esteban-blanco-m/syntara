import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// CAMBIO: Importar RouterLink
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  // CAMBIO: Añadir RouterLink a los imports
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // Corregido a styleUrls (plural)
})
export class HomeComponent {

}
