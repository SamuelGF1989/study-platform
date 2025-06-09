import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, switchMap, map } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { firstValueFrom } from 'rxjs';
import { QuizzComponent } from '../quizz/quizz.component';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule,QuizzComponent],
})
export class LessonComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private lessonService = inject(LessonService);
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);
  public router = inject(Router);

  lesson$!: Observable<Lesson | undefined>;
  safeVideoUrl!: SafeResourceUrl;
  currentUser$: Observable<User | null> = this.authService.currentUser$;
  showLogoutCard = false;
  defaultAvatar = 'assets/profile.png';

  private subscription = new Subscription();
  private timerId: any;

  currentLesson?: Lesson;
  isFinishButtonEnabled = false;
  isLessonCompleted = false;
    menuOpen = false;

  ngOnInit() {
    this.lesson$ = this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        return this.lessonService.getLessons().pipe(
          map((lessons: Lesson[]) => lessons.find(lesson => lesson.id === id)),
          map(lesson => {
            if (lesson) {
              lesson.videoUrl = this.getEmbedUrl(lesson.videoUrl);
              this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(lesson.videoUrl);
              this.currentLesson = lesson;

              this.isLessonCompleted = lesson.progress === 100;
              if (this.isLessonCompleted) {
                this.isFinishButtonEnabled = true;
              } else {
                this.isFinishButtonEnabled = false;
                this.timerId = setTimeout(() => {
                  this.isFinishButtonEnabled = true;
                }, 300); // 5 minutos
              }
            }
            return lesson;
          })
        );
      })
    );

    this.subscription.add(
      this.lesson$.subscribe()
    );
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.subscription.unsubscribe();
  }

async finalizarLeccion() {
  try {
    const user = await firstValueFrom(this.currentUser$);
    if (!user || !this.currentLesson) return;

    await this.lessonService.updateLessonProgress(this.currentLesson.id!, 100);
    this.isLessonCompleted = true;
    this.router.navigate(['/home']);
  } catch (err) {
    console.error('Error al finalizar lección:', err);
  }
}

  private getEmbedUrl(url: string): string {
    const videoIdMatch = url.match(/v=([^&]+)/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
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
    toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

closeMenu() {
  this.menuOpen = false;
}
}
