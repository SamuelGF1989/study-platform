import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthRedirectGuard } from './guards/auth-redirect.guard';
import { adminGuard } from './guards/admin.guard';
import { LessonComponent } from './pages/lesson/lesson.component';
import { VideosComponent } from './pages/videos/videos.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { ForoComponent } from './pages/foro/foro.component';
import { IntroduccionComponent } from './pages/introduccion/introduccion.component';

export const routes: Routes = [
  {
  path: 'login',
  canActivate: [AuthRedirectGuard],
  loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent } ,
  { path: 'videos', component: VideosComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'foro', component: ForoComponent },
  {path:'register',component: RegisterComponent},
  {path:'introduccion',component: IntroduccionComponent},
  {
  path: 'admin',
  canActivate: [adminGuard],
  loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  { path: 'lesson/:id', component: LessonComponent },
  { path: '**', redirectTo: 'login' } // para cualquier ruta desconocida
];
