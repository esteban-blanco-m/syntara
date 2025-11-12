// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Importa los componentes existentes
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentComponent } from './payment/payment.component';
import { authGuard } from './auth.guard';

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
    canActivate: [authGuard],
    data: { hideHeaderLinks: true }
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [authGuard],
    data: { hideHeaderLinks: true }
  },

  // --------------------------

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
