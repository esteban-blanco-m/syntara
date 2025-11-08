// src/app/payment/payment.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {

  // 💡 ¡AQUÍ ESTÁ LA CORRECCIÓN!
  // Asegúrate de que este valor sea 'false' por defecto.
  showSuccessMessage = false;

  constructor(private router: Router) { }

  onSubmit() {
    console.log('Formulario de pago enviado (Simulando API...)');

    // 1. Mostramos el mensaje (AHORA se vuelve 'true')
    this.showSuccessMessage = true;

    // 2. Esperamos 3 segundos y luego redirigimos
    setTimeout(() => {
      this.router.navigate(['/']); // Navega a la ruta raíz (home)
    }, 3000);
  }
}
