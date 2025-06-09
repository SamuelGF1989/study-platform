import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  authState,
  createUserWithEmailAndPassword,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData, collection } from '@angular/fire/firestore';
import { AppUser } from '../models/user.model';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  userData$: Observable<AppUser | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    authState(this.auth).subscribe(user => {
      this.currentUserSubject.next(user);
    });

    this.userData$ = authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user?.uid) {
          const userRef = doc(this.firestore, `users/${user.uid}`);
          return docData(userRef) as Observable<AppUser>;
        }
        return of(null);
      })
    );
  }

  // Método mejorado para registro
  registerWithEmail(name: string, email: string, password: string): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await updateProfile(user, { displayName: name });

          const userData: AppUser = {
            uid: user.uid,
            email: user.email || '',
            displayName: name,
            photoURL: user.photoURL || '',
            role: 'student',
            createdAt: new Date(),
            lastLogin: new Date()
          };

          const userRef = doc(this.firestore, `users/${user.uid}`);
          await setDoc(userRef, userData);

          // Crear subcolección inicial vacía (opcional)
          const userLessonsRef = collection(this.firestore, `users/${user.uid}/userLessons`);
          // No necesitamos documentos iniciales aquí

          return user;
        })
    );
  }

  // Método para actualizar progreso de lección
  async updateLessonProgress(lessonId: string, progress: number): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const lessonData = {
      progress,
      completed: progress === 100,
      lastUpdated: new Date()
    };

    const userLessonRef = doc(this.firestore, `users/${user.uid}/userLessons/${lessonId}`);
    await setDoc(userLessonRef, lessonData, { merge: true });
  }

  // Obtener progreso de lección
  getLessonProgress(lessonId: string): Observable<any> {
    const user = this.auth.currentUser;
    if (!user) return of(null);

    const userLessonRef = doc(this.firestore, `users/${user.uid}/userLessons/${lessonId}`);
    return docData(userLessonRef);
  }

  // Métodos existentes (login, logout, etc.) se mantienen igual...
  loginEmailPassword(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => this.updateUserData(user))
    );
  }

  loginWithGoogle(): Observable<User | null> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(({ user }) => this.updateUserData(user))
    );
  }

  private updateUserData(user: User): Observable<User | null> {
    if (!user) return of(null);

    const userRef = doc(this.firestore, `users/${user.uid}`);

    return docData(userRef).pipe(
      take(1),
      switchMap((existingUserData: any) => {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: existingUserData?.displayName || user.displayName || 'Usuario sin nombre',
          photoURL: existingUserData?.photoURL || user.photoURL || '',
          lastLogin: new Date(),
          role: existingUserData?.role || 'student'
        };

        return from(setDoc(userRef, userData, { merge: true })).pipe(
          tap(() => this.currentUserSubject.next(user)),
          switchMap(() => of(user))
        );
      })
    );
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  // En tu auth.service.ts
getUserData(uid: string): Observable<AppUser> {
  const userRef = doc(this.firestore, `users/${uid}`);
  return docData(userRef) as Observable<AppUser>;
}


}
