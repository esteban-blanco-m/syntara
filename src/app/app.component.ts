// src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importamos todo lo necesario para el enrutamiento
import { NavigationEnd, Router, RouterLink, RouterOutlet, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService, User } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'syntara';
  showHeaderLinks: boolean = true;

  // Variable para guardar el usuario actual
  currentUser: User | null = null;

  // 💡 NUEVO: Variable para controlar la pantalla de carga al salir
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {

    // Nos suscribimos a los cambios del usuario
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Lógica existente para ocultar botones en Login/Register
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const deepest = this.getDeepestRouteSnapshot(this.activatedRoute.snapshot);
      const hide = deepest?.data['hideHeaderLinks'] === true;
      this.showHeaderLinks = !hide;
    });
  }

  // 💡 MÉTODO LOGOUT MODIFICADO
  logout() {
    // 1. Activamos la pantalla de carga
    this.isLoading = true;

    // 2. Esperamos 1.5 segundos (1500 ms)
    setTimeout(() => {
      // 3. Ejecutamos el cierre de sesión real
      this.authService.logout();

      // 4. Redirigimos al home
      this.router.navigate(['/']);

      // 5. Desactivamos la pantalla de carga
      this.isLoading = false;
    }, 1500);
  }

  // Función helper existente
  private getDeepestRouteSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = snapshot;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}
