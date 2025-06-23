import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';

interface Section {
  title: string;
  text?: string;
  items?: string[];
  code?: string;
  isList?: boolean;
  isCode?: boolean;
}


@Component({
  selector: 'app-introduccion',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './introduccion.component.html',
  styleUrl: './introduccion.component.scss'
})
export class IntroduccionComponent {

   private authService = inject(AuthService);

   public router = inject(Router);
  // Datos estructurados para la vista

  currentUser$: Observable<User | null> = this.authService.currentUser$;
    defaultAvatar = 'assets/profile.png';
    showLogoutCard = false;
    menuOpen = false;
  content = {
    title: 'Introducción al Lenguaje C',
    description: 'Conceptos básicos del lenguaje de programación C',
    sections: [
      {
        title: '¿Qué es C?',
        text: 'C es un lenguaje de programación de propósito general creado en 1972 por Dennis Ritchie en los Laboratorios Bell. Es uno de los lenguajes más influyentes en la historia de la informática.',
        isList: false
      },
      {
        title: 'Características Principales',
        items: [
          'Lenguaje compilado y de alto rendimiento',
          'Acceso directo a memoria mediante punteros',
          'Portabilidad entre diferentes plataformas',
          'Estructura de programación procedural'
        ],
        isList: true
      },
      {
        title: 'Ejemplo Básico',
        code: `#include <stdio.h>

int main() {
  printf("¡Hola, mundo!\\n");
  return 0;
}`,
        isCode: true
      }
    ]
  };

  // Método auxiliar para TypeScript
  trackByIndex(index: number): number {
    return index;
  }

   toggleLogoutCard() {
    this.showLogoutCard = !this.showLogoutCard;
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.showLogoutCard = false;
        this.router.navigate(['/login']);
      })
      .catch(err => {
        console.error('Error al cerrar sesión:', err);
      });
  }

  viewLesson(lessonId: string) {
    this.router.navigate(['/lesson', lessonId]);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

}
