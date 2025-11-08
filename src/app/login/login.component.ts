import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // <-- Router es necesario para la navegación
import { AuthService } from '../auth.service'; // <-- ¡AuthService debe estar aquí!
@Component({
  selector: 'app-login',
  standalone: true,
  // ¡Añade ReactiveFormsModule y RouterLink!
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginPasswordVisible: boolean = false;

  // Inyectamos FormBuilder y el Router
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
    });
  }

  toggleLoginPass() { this.loginPasswordVisible = !this.loginPasswordVisible; }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log('Datos de Login:', this.loginForm.value);

      // 1. Marcar como logueado en el servicio (¡Esto es correcto!)
      this.authService.login();

      // 2. FORZAR LA REDIRECCIÓN a la página de planes
      alert('¡Inicio de sesión exitoso!');

      // CAMBIO CLAVE AQUÍ: Asegúrate de que la ruta es '/suscription'
      this.router.navigate(['/suscription']);

      this.loginForm.reset();
    } else {
      console.log('Formulario de login inválido');
    }
  }
}
