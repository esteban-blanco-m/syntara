import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // 1. Importa el proveedor de rutas
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // 2. Importa tu archivo de rutas

// 3. Arranca la aplicación standalone
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // 4. Provee las rutas a la aplicación
  ]
}).catch(err => console.error(err));
