import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Lesson } from '../../models/lesson.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule],
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
