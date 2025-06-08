export interface Lesson {
  id: string;           // Identificador único de la lección
  title: string;        // Título de la lección
  description: string;  // Explicación larga o desarrollo de la lección
  videoUrl: string;     // Enlace del video (YouTube, Vimeo, etc.)
  progress?: number;    // Porcentaje de avance (0–100)
}
