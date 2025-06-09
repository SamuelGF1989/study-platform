export interface Quiz {
  question: string;
  options?: string[];       // Opciones de respuesta
  correctAnswer: string;   // Respuesta correcta
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  progress?: number;
  quizzes?: Quiz[];        // Opcional, puede o no tener quizzes
}
