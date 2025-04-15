export interface Question {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
}

export interface QuestionsResponse {
  testId: string;
  questions: Question[];
}

export interface ActivityResponse {
  id: string;
  userId: string;
  type: string;
  coinType: string;
  coins: number;
  description: string;
  createdAt: string;
}

// export interface Response {
//   status: string;
//   data: QuestionsResponse;
//   message: string;
//   activity: ActivityResponse;
// }
