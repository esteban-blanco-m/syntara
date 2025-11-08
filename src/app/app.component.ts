import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. IMPORTA TODO LO NECESARIO
import { NavigationEnd, Router, RouterLink, RouterOutlet, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators'; // 2. IMPORTA 'filter'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'syntara';
  // 3. El valor por defecto es 'true'
  showHeaderLinks: boolean = true;

  // 4. Inyecta ActivatedRoute
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

    // 5. Esta es la lógica MÁS ROBUSTA que sí funciona
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Usamos la función 'getDeepestRouteSnapshot'
      const deepest = this.getDeepestRouteSnapshot(this.activatedRoute.snapshot);

      // Revisa si 'hideHeaderLinks' es true en el 'data' de la ruta más profunda
      const hide = deepest?.data['hideHeaderLinks'] === true;

      // Actualiza la variable
      this.showHeaderLinks = !hide;
    });
  }

  // 6. Esta función 'helper' es la clave.
  // Busca el 'data' en el último componente de la cadena de rutas.
  private getDeepestRouteSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = snapshot;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}
