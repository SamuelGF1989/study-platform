import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Lesson } from '../../models/lesson.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';


// Importa los consejos
import { consejosProgramacionC } from '../../models/tips';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule,MatProgressBarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private lessonService = inject(LessonService);
  public router = inject(Router);

  currentUser$: Observable<User | null> = this.authService.currentUser$;
  lessons: Lesson[] = [];
  defaultAvatar = 'assets/profile.png';
  showLogoutCard = false;
  menuOpen = false;

  // Nueva propiedad para consejo
  consejoDelDia: string = '';

  // Nueva propiedad para progreso general
  progresoGeneral: number = 0;

  ngOnInit() {
    this.mostrarConsejoAleatorio();

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

              // Calcular progreso general como promedio del progreso de todas las lecciones,
              // usando ?? 0 para evitar undefined
              const totalProgreso = this.lessons.reduce(
                (acc, lesson) => acc + (lesson.progress ?? 0),
                0
              );
              this.progresoGeneral = this.lessons.length ? totalProgreso / this.lessons.length : 0;
            },
            error: (err) => {
              console.error('Error al obtener progreso:', err);
              this.lessons = lessons.map(lesson => ({
                ...lesson,
                progress: 0
              }));
              this.progresoGeneral = 0;
            }
          });
        },
        error: (err) => {
          console.error('Error al cargar las lecciones:', err);
        }
      });
    });
  }

  mostrarConsejoAleatorio() {
    const index = Math.floor(Math.random() * consejosProgramacionC.length);
    this.consejoDelDia = consejosProgramacionC[index];
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
