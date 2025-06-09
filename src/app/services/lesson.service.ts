import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  setDoc,
  docData,
  DocumentReference
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth'; // Asegúrate de importar Auth
import { Lesson } from '../models/lesson.model';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private lessonsCollection = collection(this.firestore, 'lessons');

  constructor(
    private firestore: Firestore,
    private auth: Auth // Inyecta el servicio Auth
  ) {}

  // Método corregido para actualizar progreso
  async updateLessonProgress(lessonId: string, progress: number): Promise<void> {
    const user = this.auth.currentUser; // Accede al usuario actual
    if (!user) throw new Error('Usuario no autenticado');

    const userLessonRef = doc(
      this.firestore,
      `users/${user.uid}/userLessons/${lessonId}`
    );

    await setDoc(userLessonRef, {
      progress,
      completed: progress === 100,
      lastUpdated: new Date()
    }, { merge: true });
  }

  // Método para obtener progreso del usuario
  getUserLessonProgress(uid: string, lessonId: string): Observable<any> {
    const userLessonRef = doc(
      this.firestore,
      `users/${uid}/userLessons/${lessonId}`
    );
    return docData(userLessonRef);
  }

  // Métodos existentes se mantienen igual
  addLesson(lesson: Lesson) {
    return addDoc(this.lessonsCollection, lesson);
  }

  getLessons(): Observable<Lesson[]> {
    return collectionData(this.lessonsCollection, { idField: 'id' }) as Observable<Lesson[]>;
  }

  getAllUserLessonsProgress(uid: string): Observable<{ [lessonId: string]: number }> {
  const userLessonsCollection = collection(this.firestore, `users/${uid}/userLessons`);
  return collectionData(userLessonsCollection, { idField: 'id' }).pipe(
    map((docs: any[]) => {
      const progressMap: { [lessonId: string]: number } = {};
      docs.forEach(doc => {
        progressMap[doc.id] = doc.progress || 0;
      });
      return progressMap;
    })
  );
}
}
