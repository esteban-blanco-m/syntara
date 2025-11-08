// src/app/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Copiamos el validador de contraseña aquí
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

  constructor(private fb: FormBuilder, private router: Router) {
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

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      console.log('Datos de Registro:', this.registerForm.value);
      alert('¡Registro exitoso! Ahora inicia sesión. (Revisa la consola)');
      // Usamos el router para navegar a la página de login
      this.router.navigate(['/login']);
      this.registerForm.reset();
    } else {
      console.log('Formulario de registro inválido o las contraseñas no coinciden');
    }
  }
}
