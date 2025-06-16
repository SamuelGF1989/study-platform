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

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss'
})
export class ResourcesComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
downloads = [
    { name: 'Archivo 1', url: 'https://drive.google.com/uc?export=download&id=18NZTLAaCyQkumv0oGvumHjqfD0kGCauS' },
    { name: 'Archivo 2', url: 'https://drive.google.com/uc?export=download&id=166HUc_-iCZce0bpaqpvuM72L7xmUpULT' },
    { name: 'Archivo 3', url: 'https://drive.google.com/uc?export=download&id=1YZo_dEXA8yKNI9tKESuvLTz6XL-Kx-Hb' },
    { name: 'Archivo 4', url: 'https://drive.google.com/uc?export=download&id=19l0Y41kK_8CYPIKcvBYAybSSkvL4CUF7' },
    { name: 'Archivo 5', url: 'https://drive.google.com/uc?export=download&id=1ENNWnMFuOD5nFMdIsOX-icJUUTi9p7UU' },
    { name: 'Archivo 6', url: 'https://drive.google.com/uc?export=download&id=124wo3LogBzCa00pN5YYS5eDq1n-rVXRP' },
  ];

  private authService = inject(AuthService);
  public router = inject(Router);

  currentUser$: Observable<User | null> = this.authService.currentUser$;
  lessons: Lesson[] = [];
  defaultAvatar = 'assets/profile.png';
  showLogoutCard = false;
  menuOpen = false;


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
