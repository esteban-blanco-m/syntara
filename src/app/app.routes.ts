import { Routes } from '@angular/router';

// Importa los componentes
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// CAMBIO: Importamos 'SubscriptionComponent' (con 'b')
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentComponent } from './payment/payment.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // CORRECTO: Esta ruta NO debe tener 'data'.
  { path: '', component: HomeComponent },

  // CORRECTO: Estas rutas SÍ deben tener 'data'
  { path: 'login', component: LoginComponent, data: { hideHeaderLinks: true } },
  { path: 'register', component: RegisterComponent, data: { hideHeaderLinks: true } },

  // Rutas protegidas (también ocultamos los botones)
  {
    // CAMBIO: La ruta ahora es 'subscription' (con 'b')
    path: 'subscription',
    // CAMBIO: El componente ahora es 'SubscriptionComponent' (con 'b')
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

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
