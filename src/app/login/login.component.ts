import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service'; // <-- Importa el ApiService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginPasswordVisible: boolean = false;
  loginError: string | null = null; // Para mostrar errores

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService // <-- Inyéctalo aquí
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
    });
  }

  toggleLoginPass() { this.loginPasswordVisible = !this.loginPasswordVisible; }

  onLoginSubmit() {
    this.loginError = null; // Resetea el error
    if (this.loginForm.valid) {

      // 1. Obtenemos los valores del formulario (en español)
      const formValue = this.loginForm.value;

      // 2. Traducimos los campos a INGLÉS para el backend
      const payload = {
        email: formValue.correo,        // 'correo' -> 'email'
        password: formValue.contrasena  // 'contrasena' -> 'password'
      };

      console.log('Enviando datos de login (traducidos) al backend:', payload);

      // 3. Llama al ApiService con el payload en inglés
      this.apiService.login(payload).subscribe({
        next: (response) => {
          // El login fue exitoso (manejado dentro del ApiService)
          console.log('Login exitoso!', response);

          // Redirigimos a la página de suscripción
          this.router.navigate(['/subscription']);
          this.loginForm.reset();
        },

        // 4. 💡 MANEJO DE ERRORES MEJORADO (COPIADO DE REGISTER)
        error: (err) => {
          console.error('Error en el login:', err);

          let backendMessage = 'Credenciales incorrectas o el servidor no responde.';

          // Intentamos leer el mensaje de error específico del backend
          if (err.error && err.error.message) {
            // Para errores como { "message": "Credenciales inválidas" }
            backendMessage = err.error.message;
          } else if (err.error && typeof err.error === 'string') {
            // Si el backend envía solo un texto de error
            backendMessage = err.error;
          } else if (err.statusText) {
            // Si no, usamos el statusText (ej. "Bad Request")
            backendMessage = err.statusText;
          }

          this.loginError = `Error: ${backendMessage}`;
        }
      });

    } else {
      console.log('Formulario de login inválido');
      this.loginError = 'Por favor, introduce un correo y contraseña válidos.';
    }
  }
}
