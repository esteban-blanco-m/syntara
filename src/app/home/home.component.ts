// src/app/home/home.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <-- 1. Importa RouterOutlet aquí

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // <-- 2. Añádelo a los imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}
