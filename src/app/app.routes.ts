import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';
import { adminGuard } from './guards/admin.guard';
import { LessonComponent } from './pages/lesson/lesson.component';
import { VideosComponent } from './pages/videos/videos.component';

export const routes: Routes = [
  {
  path: 'login',
  canActivate: [AuthRedirectGuard],
  loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent } ,
  { path: 'videos', component: VideosComponent },
  {path:'register',component: RegisterComponent},
  {
  path: 'admin',
  canActivate: [adminGuard],
  loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  { path: 'lesson/:id', component: LessonComponent },
  { path: '**', redirectTo: 'login' } // para cualquier ruta desconocida
];
