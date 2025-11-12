// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';

// (El validador de contraseña se queda igual)
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const contrasena = control.get('contrasena');
  const verificarContrasena = control.get('verificarContrasena');
  if (!contrasena || !verificarContrasena || !contrasena.value || !verificarContrasena.value) {
    return null;
  }
  return contrasena.value === verificarContrasena.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerPasswordVisible: boolean = false;
  registerVerifyVisible: boolean = false;
  registerError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      verificarContrasena: ['', Validators.required],
    }, {
      validators: passwordMatchValidator
    });
  }

  toggleRegPass() { this.registerPasswordVisible = !this.registerPasswordVisible; }
  toggleRegVerify() { this.registerVerifyVisible = !this.registerVerifyVisible; }

  // 💡 --- ¡ESTA ES LA FUNCIÓN CORREGIDA! --- 💡
  onRegisterSubmit() {
    this.registerError = null;

    if (this.registerForm.valid) {

      // 1. Obtenemos los valores del formulario (en español)
      const formValue = this.registerForm.value;

      // 2. 💡 TRADUCIMOS el payload a INGLÉS (como lo espera el backend User.js)
      const payload = {
        name: formValue.nombre,         // 'nombre' -> 'name'
        lastname: formValue.apellido,   // 'apellido' -> 'lastname'
        email: formValue.correo,        // 'correo' -> 'email'
        password: formValue.contrasena  // 'contrasena' -> 'password'
      };

      // Ya no enviamos 'verificarContrasena', 'tipo_de_usuario', ni 'fecha_de_creacion'.
      // El backend (User.js) maneja 'role' y 'createdAt' automáticamente.

      console.log('Enviando datos TRADUCIDOS al backend:', payload);

      // 3. Enviamos el 'payload' (en inglés) completo al ApiService
      this.apiService.register(payload).subscribe({
        next: (response) => {
          console.log('Registro exitoso!', response);

          // NOTA: Se quitó alert() porque no funciona bien en este entorno.
          // Usamos un console.log en su lugar.
          console.log('¡Registro exitoso! Ahora inicia sesión.');

          this.router.navigate(['/login']);
          this.registerForm.reset();
        },

        // 4. 💡 MANEJO DE ERRORES MEJORADO
        error: (err) => {
          console.error('Error en el registro:', err);

          // Mensaje por defecto
          let backendMessage = 'El servidor no responde o hay un problema desconocido.';

          // Intentamos leer el mensaje de error específico del backend
          if (err.error && err.error.message) {
            // Si el backend envía algo como { "message": "El correo ya existe" }
            backendMessage = err.error.message;
          } else if (err.error && typeof err.error === 'string') {
            // Si el backend envía solo un texto de error
            backendMessage = err.error;
          } else if (err.statusText) {
            // Si no, usamos el statusText (ej. "Bad Request")
            backendMessage = err.statusText;
          }

          // Mostramos el error real en la UI
          this.registerError = `Error: ${backendMessage}`;
        }
      });

    } else {
      console.log('Formulario de registro inválido');
      this.registerError = 'Por favor, completa todos los campos correctamente.';
    }
  }
}
