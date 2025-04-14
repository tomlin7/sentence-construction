export interface Question {
  id: number;
  text: string;
  options: string[];
  blanks: string[];
  correctAnswers: Record<string, string>;
}

export interface UserAnswer {
  questionId: number;
  answers: Record<string, string>;
  isCorrect: boolean;
}
