import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  public router = inject(Router);

  loginForm: FormGroup;
  errorMsg: string | null = null;
  loading = false;
  hidePassword = true;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // En tu login.component.ts
async onLogin() {
  if (this.loginForm.invalid) return;

  this.loading = true;
  this.errorMsg = null;

  try {
    const { email, password } = this.loginForm.value;

    // 1. Autenticar al usuario
    const userCredential = await lastValueFrom(
      this.authService.loginEmailPassword(email, password).pipe(take(1))
    );

    if (!userCredential) throw new Error('Usuario no encontrado');

    // 2. Obtener datos del usuario
    const appUser = await lastValueFrom(
      this.authService.getUserData(userCredential.uid).pipe(take(1))
    );

    console.log('ROL DEL USUARIO:', appUser?.role);

    // 3. Redirección basada en el rol
    if (appUser?.role === 'admin') {
      await this.router.navigate(['/admin']);
    } else {
      await this.router.navigate(['/home']);
    }

  } catch (err: any) {
    console.error('Error en login:', err);
    this.errorMsg = this.getFriendlyError(err.code || err.message);
  } finally {
    this.loading = false;
  }
}

  async loginWithGoogle() {
    this.loading = true;
    this.errorMsg = null;

    try {
      const userCredential = await lastValueFrom(
        this.authService.loginWithGoogle().pipe(take(1))
      );

      // Redirección directa sin esperar datos adicionales
      this.router.navigateByUrl('/home', { replaceUrl: true });

    } catch (err: any) {
      console.error('Error en Google Sign-In:', err);
      this.errorMsg = this.getFriendlyError(err.code || err.message);
    } finally {
      this.loading = false;
    }
  }

  private getFriendlyError(code: string): string {
    const errors: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/popup-closed-by-user': 'Inicio con Google cancelado',
      'auth/operation-not-allowed': 'Método de login no permitido',
      'default': 'Error desconocido. Intenta nuevamente'
    };
    return errors[code] || errors['default'];
  }
}
