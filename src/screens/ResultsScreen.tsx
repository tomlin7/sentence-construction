import { Question, UserAnswer } from "@/lib/types";

interface ResultsScreenProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  score: number;
  totalQuestions: number;
  onGoToDashboard: () => void;
}

export default function ResultsScreen({
  userAnswers,
  questions,
  score,
  totalQuestions,
  onGoToDashboard,
}: ResultsScreenProps) {
  return <>Results: {score}</>;
}
