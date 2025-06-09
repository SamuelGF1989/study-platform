import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

import { LessonService } from '../../services/lesson.service';

import { Router } from '@angular/router';

interface Quiz {
  question: string;
  correctAnswer: string;
  options?: string[];
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
    MatIconModule,
    SafeUrlPipe,
  ],
})
export class AdminComponent implements OnInit {
  currentUser$!: Observable<any>;
  defaultAvatar = 'assets/default-avatar.png';
  showLogoutCard = false;

  lessons: Lesson[] = [];
  lessonForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private lessonService = inject(LessonService);
  private router = inject(Router);

  ngOnInit() {
    this.currentUser$ = this.authService.userData$;

    this.lessonForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      videoUrl: ['', Validators.required],
      quizzes: this.fb.array([]),  // Aquí van los quizzes
    });

    // Si quieres, podrías cargar lecciones de Firestore aquí y llenar this.lessons
  }

  // Getter para quizzes FormArray
  get quizzes(): FormArray {
    return this.lessonForm.get('quizzes') as FormArray;
  }

  // Método para crear un FormGroup de quiz con 4 opciones por defecto
  createQuiz(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required],
      ]),
      correctAnswer: ['', Validators.required],
    });
  }

  // Getter para las opciones de un quiz específico
  getOptions(quizIndex: number): FormArray {
    return this.quizzes.at(quizIndex).get('options') as FormArray;
  }

  // Agregar un quiz vacío al formulario
  addQuiz() {
    this.quizzes.push(this.createQuiz());
  }
  viewLesson(id: string) {
  alert(`Aquí iría la navegación o vista detallada de la lección con id: ${id}`);
}

  // Quitar quiz por índice
  removeQuiz(index: number) {
    this.quizzes.removeAt(index);
  }

  // Quitar opción de quiz (si quieres permitirlo)
  removeOption(quizIndex: number, optionIndex: number) {
    this.getOptions(quizIndex).removeAt(optionIndex);
  }

  // Agregar opción a un quiz (si quieres permitir opciones dinámicas)
  addOption(quizIndex: number) {
    this.getOptions(quizIndex).push(this.fb.control('', Validators.required));
  }

  addLesson() {
    if (this.lessonForm.invalid) return;

    const newLesson: Lesson = {
      id: '', // se llenará por Firestore
      title: this.lessonForm.value.title,
      description: this.lessonForm.value.description,
      videoUrl: this.lessonForm.value.videoUrl,
      progress: 0,
      quizzes: this.lessonForm.value.quizzes || [],
    };

    this.lessonService.addLesson(newLesson).then(() => {
      console.log('Lección agregada a Firestore');
      this.lessonForm.reset();
      // Limpiar quizzes FormArray después de resetear el formulario
      while (this.quizzes.length !== 0) {
        this.quizzes.removeAt(0);
      }
    }).catch(error => {
      console.error('Error al agregar lección:', error);
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
}
