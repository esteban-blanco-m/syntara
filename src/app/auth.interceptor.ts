import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken(); // Usamos el método de nuestro AuthService [cite: src/app/auth.service.ts]

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        // 💡 CORRECCIÓN: Se añadieron las comillas de template literal (``)
        // Esto arregló los errores de 'Bearer', '$', y 'top-level return'
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Dejamos pasar la petición original (sin token)
  return next(req);
};
