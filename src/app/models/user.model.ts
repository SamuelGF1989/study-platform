export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'student';
  createdAt?: Date;
  lastLogin?: Date;
}
