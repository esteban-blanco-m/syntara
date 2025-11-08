// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';

// (El validador de contraseña se queda igual)
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  // ... (tu lógica de validación)
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
      apellido: ['', Validators.required], // <-- El apellido ya estaba
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      verificarContrasena: ['', Validators.required],
    }, {
      validators: passwordMatchValidator
    });
  }

  toggleRegPass() { this.registerPasswordVisible = !this.registerPasswordVisible; }
  toggleRegVerify() { this.registerVerifyVisible = !this.registerVerifyVisible; }

  // 💡 --- ¡AQUÍ ESTÁ LA MODIFICACIÓN! --- 💡
  onRegisterSubmit() {
    this.registerError = null;

    if (this.registerForm.valid) {

      // 1. Obtenemos los valores del formulario
      const formValue = this.registerForm.value;

      // 2. Creamos el 'payload' final que se enviará al backend
      const payload = {
        ...formValue,
        tipo_de_usuario: 'sin suscripcion', // Atributo 1: Por defecto
        fecha_de_creacion: new Date().toISOString() // Atributo 2: Fecha actual
      };

      // (El 'apellido' ya está incluido en '...formValue')

      console.log('Enviando datos de registro (con defaults) al backend:', payload);

      // 3. Enviamos el 'payload' completo al ApiService
      this.apiService.register(payload).subscribe({
        next: (response) => {
          console.log('Registro exitoso!', response);
          alert('¡Registro exitoso! Ahora inicia sesión.');
          this.router.navigate(['/login']);
          this.registerForm.reset();
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          this.registerError = 'Error: El correo ya existe o el servidor no responde.';
        }
      });

    } else {
      console.log('Formulario de registro inválido');
      this.registerError = 'Por favor, completa todos los campos correctamente.';
    }
  }
}
