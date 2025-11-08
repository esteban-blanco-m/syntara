import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // 1. IMPORTA ESTO
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// 2. Arranca la aplicación
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // 3. AÑADE ESTO
  ]
}).catch(err => console.error(err));
