import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngIf y *ngFor
import { Quiz } from '../../models/lesson.model';

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [CommonModule], // 👈 necesario para *ngIf y *ngFor
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent {
  @Input() quizzes: Quiz[] | null = null; // 👈 permite null o undefined sin romper

  currentIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  isAnswerCorrect: boolean | null = null;

  selectAnswer(option: string) {
    this.selectedAnswer = option;
    if (!this.quizzes) return;
    this.isAnswerCorrect = option === this.quizzes[this.currentIndex].correctAnswer;
  }

  nextQuestion() {
    if (!this.quizzes) return;

    if (this.isAnswerCorrect) {
      this.score++;
    }
    this.currentIndex++;
    this.selectedAnswer = null;
    this.isAnswerCorrect = null;
  }

  restart() {
    this.currentIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.isAnswerCorrect = null;
  }
}
