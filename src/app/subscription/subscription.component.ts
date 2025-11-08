// src/app/suscription/suscription.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <--- ¡DEBE ESTAR ESTO!

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, RouterLink], // <--- ¡DEBE ESTAR EN LOS IMPORTS!
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
}
