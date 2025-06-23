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
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { consejosProgramacionC } from '../../models/tips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private lessonService = inject(LessonService);
  private http = inject(HttpClient);
  public router = inject(Router);

  currentUser$: Observable<User | null> = this.authService.currentUser$;
  lessons: Lesson[] = [];
  defaultAvatar = 'assets/profile.png';
  showLogoutCard = false;
  menuOpen = false;

  consejoDelDia: string = '';
  progresoGeneral: number = 0;
  searchTerm: string = '';

  // 🖥️ Código y salida del compilador
  codigoC: string = `#include <stdio.h>\nint main() {\n    printf("Hola desde C!\\n");\n    return 0;\n}`;
  resultadoCompilacion: string = '';
  compilando: boolean = false;

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

  filteredLessons(): Lesson[] {
    const term = this.searchTerm.toLowerCase().trim();
    return this.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(term)
    );
  }

  ejecutarCodigo() {
    this.compilando = true;
    this.resultadoCompilacion = '';

    const body = {
      language_id: 50, // ID para lenguaje C
      source_code: this.codigoC,
      stdin: ''
    };

    const headers = {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '90b4e6170cmsh8ee908f4b6c129fp1b3cbajsna03bdd1e40d4', // Reemplaza con tu clave real
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    };

    this.http.post<any>('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', body, { headers })
      .subscribe({
        next: (res) => {
          this.compilando = false;
          this.resultadoCompilacion = res.stdout || res.stderr || 'Sin salida';
        },
        error: (err) => {
          this.compilando = false;
          console.error('Error al compilar:', err);
          this.resultadoCompilacion = 'Error al compilar o conectar con la API.';
        }
      });
  }
}
