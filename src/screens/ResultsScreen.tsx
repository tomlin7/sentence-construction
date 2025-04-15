import { Question } from "@/types";
import { ArrowLeft, ChevronDown, MoreHorizontal } from "lucide-react";

interface UserAnswer {
  questionId: string;
  answers: string[];
  isCorrect: boolean;
}

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
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="flex justify-between px-20 p-4 shadow-lg/4">
        <button className="p-2 rounded-full hover:bg-gray-50">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="absolute left-1/2 text-xl transform -translate-x-1/2 font-medium text-gray-700">
          Sentence Construction
        </h1>
        <button className="p-2 rounded-full hover:bg-gray-50">
          <MoreHorizontal className="w-6 h-6 text-gray-700" />
        </button>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx={50}
                cy={50}
                r={45}
                fill="none"
                stroke="#f0f0f0"
                strokeWidth={10}
              />
              <circle
                cx={50}
                cy={50}
                r={45}
                fill="none"
                stroke={
                  percentage >= 70
                    ? "#317f39"
                    : percentage >= 40
                    ? "#f5ce00"
                    : "#9e2930"
                }
                strokeWidth={10}
                strokeDasharray={`${percentage * 2.83} 283`}
                strokeDashoffset={0}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">{percentage}</div>
              <div className="text-xs text-gray-600">Overall Score</div>
            </div>
          </div>

          <p className="text-center text-gray-600 mb-8 max-w-md">
            {percentage >= 90
              ? "Excellent! You've mastered sentence construction with very few errors."
              : percentage >= 70
              ? "While you correctly formed several sentences, there are a couple of areas where improvement is needed. Pay close attention to sentence structure and word placement to ensure clarity and correctness. Review your responses below for more details."
              : percentage >= 50
              ? "You're making progress, but there's room for improvement. Focus on understanding how words fit together in sentences."
              : "You need more practice with sentence construction. Review the correct answers below and try again."}
          </p>

          <button
            onClick={onGoToDashboard}
            className="px-6 py-3 mb-8 border border-indigo-500 rounded-lg text-indigo-600 hover:bg-gray-200"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => {}}
            className="flex items-center justify-center w-8 h-8 m-4 animate-bounce"
          >
            <ChevronDown className="w-10 h-10 text-gray-600" />
          </button>
        </div>

        <div className="w-full space-y-20">
          {userAnswers.map((userAnswer, index) => {
            const question = questions.find(
              (q) => q.questionId === userAnswer.questionId
            )!;

            const userSentence = question.question
              .split("_____________")
              .reduce((sentence, part, idx, arr) => {
                if (idx === arr.length - 1) return sentence + part;
                return sentence + part + (userAnswer.answers[idx] || "_____");
              }, "");

            const correctSentence = question.question
              .split("_____________")
              .reduce((sentence, part, idx, arr) => {
                if (idx === arr.length - 1) return sentence + part;
                return (
                  sentence + part + (question.correctAnswer[idx] || "_____")
                );
              }, "");

            return (
              <div
                key={index}
                className={`bg-white rounded-lg drop-shadow-2xl/7 ${
                  userAnswer.isCorrect
                    ? "drop-shadow-green-600"
                    : "drop-shadow-red-600"
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[#414343] bg-gray-100 rounded-md px-1">
                      Prompt
                    </div>
                    <div className="flex text-sm text-[#7c8181]">
                      <div className="font-semibold text-gray-800">
                        {index + 1}
                      </div>
                      /{totalQuestions}
                    </div>
                  </div>
                  <p className="mb-6">{correctSentence}</p>
                </div>

                <div className="bg-gray-50 p-5">
                  <div className="flex items-center mb-2">
                    <div className="font-medium text-[#414343] mr-2">
                      Your response:
                    </div>
                    <div
                      className={`font-semibold px-2 py-0.5 rounded-full ${
                        userAnswer.isCorrect
                          ? "text-green-700 bg-green-700/5"
                          : "text-red-700 bg-red-700/5"
                      }`}
                    >
                      {userAnswer.isCorrect ? "Correct" : "Incorrect"}
                    </div>
                  </div>

                  <p>{userSentence}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
