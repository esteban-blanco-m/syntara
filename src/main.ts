import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // 1. IMPORTA HttpClient
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// 2. Arranca la aplicación
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()) // 3. AÑADE ESTO para que ApiService funcione
  ]
}).catch(err => console.error(err));
