import { Question } from "@/lib/types";

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: (answers: Record<string, string>) => void;
  onQuit: () => void;
  timeLimit: number;
}

export default function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  onNext,
  onQuit,
  timeLimit,
}: QuestionScreenProps) {
  return <>Question no {questionNumber}</>;
}
