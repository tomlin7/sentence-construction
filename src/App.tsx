import { useState, useEffect } from "react";
import { ActivityResponse, Question, QuestionsResponse } from "./types";
import StartScreen from "./screens/StartScreen";
import QuestionScreen from "./screens/QuestionScreen";
import ResultsScreen from "./screens/ResultsScreen";

const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log(BASE_URL);

interface UserAnswer {
  questionId: string;
  answers: string[];
  isCorrect: boolean;
}

type AppScreen = "start" | "question" | "results";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    fetchQuestions();
    fetchActivity();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/data`);
      const data: QuestionsResponse = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      setError("Failed to fetch questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch(`${BASE_URL}/activity`);
      const data: ActivityResponse = await response.json();
      setCoins(data.coins);
    } catch (error) {}
  };

  const handleStartQuiz = () => {
    setCurrentScreen("question");
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
  };

  const handleNextQuestion = (answers: string[]) => {
    const question = questions[currentQuestionIndex];
    const isCorrect = answers.every(
      (answer, index) => answer === question.correctAnswer[index]
    );

    setUserAnswers([
      ...userAnswers,
      {
        questionId: question.questionId,
        answers,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentScreen("results");
    }
  };

  const handleQuit = () => {
    setCurrentScreen("start");
  };

  const handleGoToDashboard = () => {
    setCurrentScreen("start");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-700 text-xl">
        {error}
        <div className="flex flex-col gap-5 text-gray-700">
          Make sure the json-server is running:
          <code className="flex items-center justify-center bg-gray-700 text-gray-100 p-5 rounded-md border-4 border-black">
            $ bun run server
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {currentScreen === "start" && (
        <StartScreen
          onStart={handleStartQuiz}
          coins={coins}
          totalQuestions={questions.length}
        />
      )}

      {currentScreen === "question" && (
        <QuestionScreen
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onNext={handleNextQuestion}
          onQuit={handleQuit}
          timeLimit={30}
        />
      )}

      {currentScreen === "results" && (
        <ResultsScreen
          userAnswers={userAnswers}
          questions={questions}
          score={score}
          totalQuestions={questions.length}
          onGoToDashboard={handleGoToDashboard}
        />
      )}
    </div>
  );
}
