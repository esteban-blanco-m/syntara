// src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Importa nuestro servicio

export const authGuard: CanActivateFn = (route, state) => {

  // Inyectamos el servicio y el router
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprueba si el usuario está logueado
  if (authService.isLoggedIn()) {
    return true; // Sí puede pasar
  } else {
    // No está logueado, lo redirigimos al login
    router.navigate(['/login']);
    return false; // No puede pasar
  }
};
