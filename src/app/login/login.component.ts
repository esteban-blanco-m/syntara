import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service'; // <-- 1. Importa el ApiService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html', // <-- CORRECCIÓN: Apunta al HTML correcto
  styleUrls: ['./login.component.scss']
})
export class LoginComponent { // <-- CORRECCIÓN: Exporta la clase correcta
  loginForm: FormGroup;
  loginPasswordVisible: boolean = false;
  loginError: string | null = null; // Para mostrar errores

  // 2. Inyecta ApiService
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService // <-- 2. Inyéctalo aquí
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
      console.log('Enviando datos al backend:', this.loginForm.value);

      // 3. Llama al ApiService en lugar de la lógica de mentira
      this.apiService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // El login fue exitoso (manejado dentro del ApiService)
          console.log('Login exitoso!', response);

          // Redirigimos a la página de suscripción
          this.router.navigate(['/suscription']);
          this.loginForm.reset();
        },
        error: (err) => {
          // Si el backend devuelve un error (ej. 401, 404, 500)
          console.error('Error en el login:', err);
          this.loginError = 'Error: Credenciales incorrectas o el servidor no responde.';
          // No llames a authService.login() si hay un error
        }
      });

    } else {
      console.log('Formulario de login inválido');
      this.loginError = 'Por favor, introduce un correo y contraseña válidos.';
    }
  }
}
