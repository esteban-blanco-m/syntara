// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Importa los componentes existentes
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentComponent } from './payment/payment.component';
import { authGuard } from './auth.guard'; //

// --- 1. IMPORTA EL NUEVO COMPONENTE DE HISTORIAL ---
import { HistoryComponent } from './history/history.component';


export const routes: Routes = [
  // Ruta Home (Pública) - NO LLEVA DATA
  { path: '', component: HomeComponent },

  // Rutas donde SÍ se ocultan los botones
  {
    path: 'login',
    component: LoginComponent,
    data: { hideHeaderLinks: true }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { hideHeaderLinks: true }
  },

  // Rutas protegidas (también ocultamos los botones)
  {
    path: 'subscription',
    component: SubscriptionComponent,
    canActivate: [authGuard], //
    data: { hideHeaderLinks: true }
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [authGuard], //
    data: { hideHeaderLinks: true }
  },

  // --- 2. AÑADE LA NUEVA RUTA DE HISTORIAL ---
  // Esta ruta está protegida por el authGuard
  // No ocultamos los links del header aquí
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard] //
  },

  // --------------------------

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
