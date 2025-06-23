import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { AppUser } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ForumPost } from '../../models/forumPost.model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs/operators';
import { Timestamp } from '@angular/fire/firestore';
import { ForumComment } from '../../models/forumComment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss']
})
export class ForoComponent implements OnInit {
  private authService = inject(AuthService);
  public router = inject(Router);

  currentUser: User | null = null;
  usuarioActivo: AppUser | null = null;
  posts$!: Observable<ForumPost[]>;
  nuevoPost: string = '';
  likedPostIds: Set<string> = new Set();

    defaultAvatar = 'assets/profile.png';
  showLogoutCard = false;
  menuOpen = false;

  comentarios: { [postId: string]: ForumComment[] } = {};
  nuevoComentario: { [postId: string]: string } = {};
  currentUser$: Observable<User | null> = this.authService.currentUser$;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user?.uid) {
        this.authService.getUserData(user.uid).subscribe(data => {
          this.usuarioActivo = data;
        });
      }
    });

    this.posts$ = this.authService.getForumPosts().pipe(
      map(posts => {
        posts.forEach(post => {
          if (post.id) {
            this.authService.getCommentsForPost(post.id).subscribe(comments => {
              this.comentarios[post.id!] = comments.map(c => ({
                ...c,
                timestamp: c.timestamp instanceof Timestamp ? c.timestamp.toDate() : c.timestamp
              }));
            });
          }
        });
        return posts.map(post => ({
          ...post,
          timestamp: post.timestamp instanceof Timestamp ? post.timestamp.toDate() : post.timestamp
        }));
      })
    );
  }

  crearPost() {
    if (!this.nuevoPost.trim() || !this.currentUser || !this.usuarioActivo) return;

    const post: ForumPost = {
      authorId: this.currentUser.uid,
      authorName: this.usuarioActivo.displayName || 'Anónimo',
      content: this.nuevoPost.trim(),
      timestamp: new Date(),
      likes: 0
    };

    this.authService.addForumPost(post).then(() => {
      this.nuevoPost = '';
    });
  }

  darLike(post: ForumPost) {
    if (!post.id) return;

    if (this.likedPostIds.has(post.id)) {
      this.likedPostIds.delete(post.id);
      this.authService.updateForumPostLikes(post.id, post.likes - 1);
    } else {
      this.likedPostIds.add(post.id);
      this.authService.updateForumPostLikes(post.id, post.likes + 1);
    }
  }

  crearComentario(postId: string) {
    const contenido = this.nuevoComentario[postId]?.trim();
    if (!contenido || !this.currentUser || !this.usuarioActivo) return;

    const comentario: ForumComment = {
      authorId: this.currentUser.uid,
      authorName: this.usuarioActivo.displayName || 'Anónimo',
      content: contenido,
      timestamp: new Date()
    };

    this.authService.addCommentToPost(postId, comentario).then(() => {
      this.nuevoComentario[postId] = '';
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

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
