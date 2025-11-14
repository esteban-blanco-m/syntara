import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- IMPORTA ESTO
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth.interceptor'; // <-- IMPORTA TU INTERCEPTOR

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    // AÑADE ESTOS PROVIDERS:
    // Esto configura HttpClient globalmente y le dice que use tu interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
}).catch(err => console.error(err));
