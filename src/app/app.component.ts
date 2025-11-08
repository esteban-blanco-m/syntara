import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true, // 1. ES STANDALONE
  imports: [
    CommonModule,    // 2. Importa CommonModule para *ngIf
    RouterLink,      // 3. Importa RouterLink para los enlaces
    RouterOutlet     // 4. Importa RouterOutlet para mostrar las rutas
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showHeaderLinks = true; // Valor por defecto

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

    // Esta es la lógica limpia que detecta el cambio de ruta
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const deepest = this.getDeepestRouteSnapshot(this.activatedRoute.snapshot);
      const hide = deepest?.data['hideHeaderLinks'] === true;
      this.showHeaderLinks = !hide;
    });
  }

  private getDeepestRouteSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = snapshot;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}
