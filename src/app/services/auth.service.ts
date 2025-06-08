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
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';
import { AppUser } from '../models/user.model';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Observable que expone el usuario extendido (con rol)
  userData$: Observable<AppUser | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // Escucha cambios de autenticación de Firebase
    authState(this.auth).subscribe(user => {
      this.currentUserSubject.next(user);
    });

    // Carga los datos extendidos del usuario desde Firestore
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

  // Login con email y contraseña
  loginEmailPassword(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => this.updateUserData(user))
    );
  }

  // Login con Google
  loginWithGoogle(): Observable<User | null> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(({ user }) => this.updateUserData(user))
    );
  }

  // Registrar con email, nombre y contraseña
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

          return user;
        })
    );
  }

  // Guarda o actualiza datos del usuario en Firestore
 private updateUserData(user: User): Observable<User | null> {
  if (!user) return of(null);

  const userRef = doc(this.firestore, `users/${user.uid}`);

  return docData(userRef).pipe(
    take(1), // Solo la primera emisión
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

  // Cerrar sesión
  logout(): Promise<void> {
    return this.auth.signOut();
  }

  // Obtener token del usuario
  getIdToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() ?? Promise.resolve(null);
  }

  // Verifica si hay un usuario autenticado
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  // Obtener datos de un usuario por ID
  getUserData(uid: string): Observable<AppUser> {
    const userRef = doc(this.firestore, `users/${uid}`);
    return docData(userRef) as Observable<AppUser>;
  }
}
