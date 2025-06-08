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
  private router = inject(Router);

  currentUser$: Observable<User | null> = this.authService.currentUser$;
  lessons: Lesson[] = [];
  defaultAvatar = 'assets/profile.png';
  showLogoutCard = false;

  ngOnInit() {
    // Suscribirse a la colección de lecciones
    this.lessonService.getLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons;
      },
      error: (err) => {
        console.error('Error al cargar las lecciones:', err);
      }
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
}
