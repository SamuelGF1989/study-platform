import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthRedirectGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.userData$.pipe(
      map(user => {
        if (user) {
          if (user.role === 'admin') {
            this.router.navigate(['/admin'], { replaceUrl: true }).then(() => {
              this.location.replaceState('/admin');
            });
            return false;
          } else {
            this.router.navigate(['/home'], { replaceUrl: true }).then(() => {
              this.location.replaceState('/home');
            });
            return false;
          }
        }
        // No está logueado, puede acceder (ej. login)
        return true;
      })
    );
  }
}
