import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { PaymentComponent } from './payment/payment.component';
import { authGuard } from './auth.guard';
import { HistoryComponent } from './history/history.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
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
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard] //
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
