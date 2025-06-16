import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../models/lesson.model';

@Component({
  selector: 'app-quizz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent {
  @Input() quizzes: Quiz[] | null = null;

  currentIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  isAnswerCorrect: boolean | null = null;
  fraseMotivadora: string = '';

 frasesCorrectas = [
  '¡Muy bien! Sigue así.',
  '¡Excelente trabajo!',
  '¡Sigue con ese ritmo!',
  '¡Eres un crack!',
  '¡Perfecto, continúa así!',
  'Tu poder está creciendo como el de Goku en sus transformaciones.',
  'Impresionante, con la determinación de Naruto en sus batallas.',
  'Esa respuesta tiene la energía de un ataque de Luffy.',
  'Lo hiciste con la fuerza y coraje de Deku.',
  'Sigue así, con la valentía de un héroe de My Hero Academia.',
  'Has demostrado la paciencia y destreza de un shinobi experto.',
  'Tu mente es tan aguda como la de Light Yagami.',
  'Esa fue una respuesta que brilla como un Kamehameha.',
  'Tu esfuerzo es tan intenso como el entrenamiento de Tanjiro.',
  'Lo resolviste con la estrategia de Lelouch vi Britannia.',
  'Has dado un salto como los cazadores en su viaje.',
  'Tu conocimiento es tan sólido como la voluntad de Mikasa.',
  'Esa respuesta fue tan fuerte como un Bankai de Bleach.',
  'Tienes la precisión de un francotirador como Kurapika.',
  'Como un guerrero Saiyan, cada paso te hace más fuerte.',
  'Tu determinación rivaliza con la de Eren Jaeger.',
  'Sigues avanzando con la fuerza de un espadachín legendario.',
  'Tu respuesta es digna de un maestro del Colegio U.A.',
  'Sigue entrenando con la dedicación de Jiraiya.',
  'Has alcanzado un nivel digno de los héroes de la Liga de Villanos.',
  'Tu respuesta es tan brillante como la luz de un espíritu de fuego.',
  'Lo hiciste con la precisión de un luchador de Demon Slayer.',
  'Tu esfuerzo es comparable al de un Cazador en entrenamiento.',
  'Tienes la agilidad y astucia de un ninja de Konoha.',
  'Tu mente estratégica recuerda a la de Shikamaru.',
  'Esta respuesta tiene el poder de un ataque de titan.',
  'Estás progresando como un campeón de Torneos Tenkaichi.',
  'Tu habilidad es tan impresionante como la de un miembro de los Hellsing.',
  'Tienes la fuerza interior de un joven samurái.',
  'Lo hiciste con la calma de un maestro espadachín.',
  'Tu mente rápida es como la de un detective genial.',
  'Has avanzado como un guerrero que nunca se rinde.',
  'Esta respuesta demuestra el coraje de un héroe de la resistencia.',
  'Sigue con la valentía de un soldado en batalla.',
  'Tu desempeño es tan brillante como la luz de un zorro de nueve colas.',
  'Has mostrado el poder de un luchador decidido.',
  'Tu respuesta es tan clara como una estrategia bien planeada.',
  'Lo hiciste con la fuerza de un ataque especial.',
  'Tienes el temple de un maestro samurái.',
  'Esa respuesta refleja el corazón de un verdadero héroe.',
  'Sigues creciendo como un protagonista que supera sus límites.',
  'Tu precisión y rapidez son dignas de un ninja elite.',
  'Eres un verdadero guerrero del conocimiento.',
  'Cada respuesta correcta te acerca más al nivel de un campeón.',
  'Has demostrado la determinación y fuerza de un líder legendario.'
];


 frasesIncorrectas = [
  'No te desanimes, incluso los grandes caen antes de levantarse.',
  'Como Naruto aprendiendo, cada error te hace más fuerte.',
  'Incluso Goku tuvo que entrenar duro para llegar aquí.',
  'No pasa nada, cada tropiezo es parte del camino hacia la victoria.',
  'Sigue adelante, como un ninja que nunca abandona su sueño.',
  'Los héroes también enfrentan derrotas antes de triunfar.',
  'No te rindas, la perseverancia es la clave de Deku.',
  'Cada error es un paso más para dominar la técnica.',
  'No pierdas la esperanza, Eren también tuvo dificultades.',
  'Levántate con la fuerza de un cazador decidido.',
  'El camino es difícil, pero la recompensa vale la pena.',
  'Cada batalla perdida es una lección para la próxima.',
  'Sigue entrenando, como Jiraiya antes de sus grandes combates.',
  'Los verdaderos guerreros aprenden de sus caídas.',
  'No te preocupes, incluso Luffy a veces falla antes de ganar.',
  'Cada intento te acerca más a la victoria final.',
  'No dejes que un error defina tu camino.',
  'Sigue luchando, la fuerza está en tu voluntad.',
  'Recuerda, la verdadera fuerza viene del corazón y la perseverancia.',
  'Como Tanjiro, no te rindas nunca aunque el camino sea duro.',
  'Cada derrota es solo un capítulo más en tu historia de éxito.',
  'El fracaso no es el fin, solo el comienzo de algo mejor.',
  'Sigue con el espíritu indomable de un guerrero.',
  'No te detengas, como un cazador buscando su meta.',
  'Los grandes logros vienen después de muchos intentos.',
  'Cada caída fortalece tu determinación.',
  'No te frustres, la paciencia es la clave de un buen shinobi.',
  'Cada error es una oportunidad para aprender y crecer.',
  'No pierdas el ánimo, como un héroe en entrenamiento.',
  'Cada paso atrás es solo impulso para avanzar más fuerte.',
  'No olvides que los verdaderos campeones nunca se rinden.',
  'Sigue adelante, como un espadachín buscando la perfección.',
  'Las dificultades solo forjan a los verdaderos guerreros.',
  'No dejes que un tropiezo te quite la voluntad de seguir.',
  'Cada error te acerca un poco más a la maestría.',
  'La perseverancia es lo que diferencia a los campeones.',
  'Como un líder en batalla, sigue guiando tu camino con fuerza.',
  'Sigue luchando, el poder verdadero está en la constancia.',
  'No te rindas, la victoria está al final del camino.',
  'Cada intento fallido es una lección para el futuro.',
  'Sigue entrenando como un joven héroe decidido.',
  'No pierdas la esperanza, cada día es una nueva oportunidad.',
  'La fuerza interior se construye con cada desafío superado.',
  'No te desanimes, las caídas son parte del viaje.',
  'Sigue con la pasión y determinación de un verdadero guerrero.',
  'Cada error es un paso más hacia el éxito.',
  'No te rindas, estás más cerca de lo que crees.',
  'Tu esfuerzo será recompensado si sigues adelante.',
  'Cada derrota temporal es el preludio de una gran victoria.'
];



  selectAnswer(option: string) {
    this.selectedAnswer = option;
    if (!this.quizzes) return;
    this.isAnswerCorrect = option === this.quizzes[this.currentIndex].correctAnswer;

    if (this.isAnswerCorrect) {
      this.fraseMotivadora = this.getFraseAleatoria(this.frasesCorrectas);
    } else {
      this.fraseMotivadora = this.getFraseAleatoria(this.frasesIncorrectas);
    }
  }

  getFraseAleatoria(frases: string[]): string {
    const index = Math.floor(Math.random() * frases.length);
    return frases[index];
  }

  nextQuestion() {
    if (!this.quizzes) return;

    if (this.isAnswerCorrect) {
      this.score++;
    }
    this.currentIndex++;
    this.selectedAnswer = null;
    this.isAnswerCorrect = null;
    this.fraseMotivadora = '';
  }

  restart() {
    this.currentIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.isAnswerCorrect = null;
    this.fraseMotivadora = '';
  }
}
