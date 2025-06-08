import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

import { LessonService } from '../../services/lesson.service';

import { Router } from '@angular/router';



interface Quiz {
  question: string;
  correctAnswer: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  progress: number;
  quizzes?: Quiz[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    SafeUrlPipe, // ← importante agregar aquí también
  ],
})


export class AdminComponent implements OnInit {
  currentUser$!: Observable<any>;
  defaultAvatar = 'assets/default-avatar.png';
  showLogoutCard = false;

  lessons: Lesson[] = [];
  lessonForm!: FormGroup;

  quizFormVisible = false;
  quizForm!: FormGroup;
  selectedLesson?: Lesson;



  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private lessonService = inject(LessonService);
  private router = inject(Router);

  ngOnInit() {
    this.currentUser$ = this.authService.userData$;

  this.lessonForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    videoUrl: ['', Validators.required]
  });

    this.quizForm = this.fb.group({
      question: ['', Validators.required],
      correctAnswer: ['', Validators.required],
    });

    // Aquí podrías cargar lecciones de Firestore
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

addLesson() {
  if (this.lessonForm.invalid) return;

  const newLesson: Lesson = {
    id: '', // se llenará después por Firestore
    title: this.lessonForm.value.title,
    description: this.lessonForm.value.description,
    videoUrl: this.lessonForm.value.videoUrl,
    progress: 0
  };

  this.lessonService.addLesson(newLesson).then(() => {
    console.log('Lección agregada a Firestore');
    this.lessonForm.reset();
  }).catch(error => {
    console.error('Error al agregar lección:', error);
  });
}
  viewLesson(id: string) {
    alert(`Aquí iría la navegación o vista detallada de la lección con id: ${id}`);
  }

  openAddQuiz(lesson: Lesson) {
    this.selectedLesson = lesson;
    this.quizFormVisible = true;
  }

  addQuiz() {
    if (!this.selectedLesson || this.quizForm.invalid) return;
    const quiz: Quiz = {
      question: this.quizForm.value.question,
      correctAnswer: this.quizForm.value.correctAnswer,
    };
    this.selectedLesson.quizzes?.push(quiz);
    this.quizForm.reset();
    this.quizFormVisible = false;
  }

  cancelAddQuiz() {
    this.quizFormVisible = false;
    this.quizForm.reset();
  }
}
