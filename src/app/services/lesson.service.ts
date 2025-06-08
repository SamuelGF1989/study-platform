import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, setDoc, docData } from '@angular/fire/firestore';
import { Lesson } from '../models/lesson.model';
import { map, Observable } from 'rxjs';
// ...

@Injectable({ providedIn: 'root' })
export class LessonService {
  private lessonsCollection = collection(this.firestore, 'lessons');

  constructor(private firestore: Firestore) {}

  addLesson(lesson: Lesson) {
    return addDoc(this.lessonsCollection, lesson);
  }

  getLessons(): Observable<Lesson[]> {
    return collectionData(this.lessonsCollection, { idField: 'id' }) as Observable<Lesson[]>;
  }

  updateUserLessonProgress(userId: string, lessonId: string, progress: number) {
  const docId = `${userId}_${lessonId}`;
  const docRef = doc(this.firestore, 'progress', docId);
  return setDoc(docRef, { userId, lessonId, progress }, { merge: true });
}

getUserLessonProgress(uid: string): Observable<{ [lessonId: string]: number }> {
  const progressDocRef = doc(this.firestore, `progress/${uid}`);
  return docData(progressDocRef) as Observable<{ [lessonId: string]: number }>;
}
}
