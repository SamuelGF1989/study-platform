import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent {
  // Inyección con API inject() para standalone
  private authService = inject(AuthService);
  private lessonService = inject(LessonService);
  public router = inject(Router);
  public sanitizer = inject(DomSanitizer);

  showLogoutCard = false;
  menuOpen = false;
  lessons: Lesson[] = [];
  currentUser$: Observable<User | null> = this.authService.currentUser$;

  defaultAvatar = 'assets/profile.png';

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      if (!user?.uid) return;

      this.lessonService.getLessons().subscribe({
        next: (lessons) => {
          this.lessonService.getAllUserLessonsProgress(user.uid).subscribe({
            next: (progressMap) => {
              this.lessons = lessons.map(lesson => ({
                ...lesson,
                progress: progressMap[lesson.id] || 0
              }));
            },
            error: (err) => {
              console.error('Error al obtener progreso:', err);
              this.lessons = lessons.map(lesson => ({
                ...lesson,
                progress: 0
              }));
            }
          });
        },
        error: (err) => {
          console.error('Error al cargar las lecciones:', err);
        }
      });
    });
  }


  temas = [
    {
      nombre: 'PUNTEROS',
      videos: [
        {
          titulo: '¿Qué es HTML?',
          descripcion: 'Aprende los fundamentos de HTML.',
          url: 'https://www.youtube.com/embed/UB1O30fR-EE'
        },
        {
          titulo: 'Flexbox explicado fácil',
          descripcion: 'Guía visual de Flexbox.',
          url: 'https://www.youtube.com/embed/JJSoEo8JSnc'
        }
      ]
    },
    {
      nombre: 'MANEJO DE ARCHIVOS',
      videos: [
        {
          titulo: 'JavaScript desde cero',
          descripcion: 'Todo lo que necesitas para empezar.',
          url: 'https://www.youtube.com/embed/PkZNo7MFNFg'
        }
      ]
    },
       {
      nombre: 'CICLOS',
      videos: [
        {
          titulo: 'JavaScript desde cero',
          descripcion: 'Todo lo que necesitas para empezar.',
          url: 'https://www.youtube.com/embed/PkZNo7MFNFg'
        }
      ]
    },
       {
      nombre: 'ARREGLOS',
      videos: [
        {
          titulo: 'JavaScript desde cero',
          descripcion: 'Todo lo que necesitas para empezar.',
          url: 'https://www.youtube.com/embed/PkZNo7MFNFg'
        }
      ]
    },
       {
      nombre: 'FUNCIONES',
      videos: [
        {
          titulo: 'JavaScript desde cero',
          descripcion: 'Todo lo que necesitas para empezar.',
          url: 'https://www.youtube.com/embed/PkZNo7MFNFg'
        }
      ]
    }
  ];

  // Header/logout handlers
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
