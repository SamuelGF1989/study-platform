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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  errorMsg: string | null = null;
  loading = false;
  hidePassword = true;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onRegister() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMsg = null;

    try {
      const { name, email, password } = this.registerForm.value;
      await this.authService.registerWithEmail(name, email, password).toPromise();
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.errorMsg = this.getFriendlyError(err.code);
      console.error('Register error:', err);
    } finally {
      this.loading = false;
    }
  }

  private getFriendlyError(code: string): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use': 'El correo ya está en uso',
      'auth/invalid-email': 'Email inválido',
      'auth/weak-password': 'Contraseña débil',
      'default': 'Error desconocido. Intenta nuevamente'
    };
    return errors[code] || errors['default'];
  }
}
