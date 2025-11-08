import { Component } from '@angular/core';
// CAMBIO: Importar CommonModule y RouterLink
import { CommonModule } from '@angular/common';
// CAMBIO: Importar NavigationEnd, Router, RouterLink, RouterOutlet
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  // CAMBIO: Añadir CommonModule y RouterLink a los imports
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corregido a styleUrls (plural)
})
export class AppComponent {
  title = 'syntara';
  showHeaderLinks: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Esta lógica es para ocultar los enlaces en login/register
        const routeData = this.router.routerState.root.firstChild?.snapshot.data;
        this.showHeaderLinks = !routeData?.['hideHeaderLinks'];
      }
    });
  }
}
