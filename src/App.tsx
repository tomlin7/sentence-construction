import { useState } from "react";
import { Question, UserAnswer } from "./lib/types";
import StartScreen from "./screens/StartScreen";
import QuestionScreen from "./screens/QuestionScreen";
import ResultsScreen from "./screens/ResultsScreen";

const questions: Question[] = [
  {
    id: 1,
    text: "Yesterday, we had a [blank1] discussion about the project, but it [blank2] into an argument because everyone had [blank3] opinions on the final [blank4].",
    options: ["Different", "Turned", "Quick", "Outcome"],
    blanks: ["blank1", "blank2", "blank3", "blank4"],
    correctAnswers: {
      blank1: "Different",
      blank2: "Turned",
      blank3: "Quick",
      blank4: "Outcome",
    },
  },
  {
    id: 2,
    text: "The cat [blank1] the mouse across the yard, [blank2] over obstacles along the way.",
    options: ["chased", "followed", "leaping", "jumping"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "chased",
      blank2: "leaping",
    },
  },
  {
    id: 3,
    text: "She [blank1] finished her homework before dinner, [blank2] she had time to relax afterward.",
    options: ["quickly", "carefully", "ensuring", "because"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "quickly",
      blank2: "ensuring",
    },
  },
  {
    id: 4,
    text: "The boy [blank1] quickly was hard to catch, as he [blank2] between the trees with incredible speed.",
    options: ["running", "walking", "darted", "moved"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "running",
      blank2: "darted",
    },
  },
  {
    id: 5,
    text: "We will [blank1] to the market after school to buy [blank2] vegetables and fruits for the week.",
    options: ["go", "walk", "fresh", "ripe"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "go",
      blank2: "fresh",
    },
  },
  {
    id: 6,
    text: "Had the car [blank1] been parked outside yesterday, it would have been an [blank2] for others to drive by.",
    options: ["red", "not", "obstacle", "problem"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "red",
      blank2: "obstacle",
    },
  },
  {
    id: 7,
    text: "The [blank1] was so [blank2] that we decided to stay indoors and watch a movie instead.",
    options: ["weather", "rain", "cold", "terrible"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "weather",
      blank2: "terrible",
    },
  },
  {
    id: 8,
    text: "After the [blank1], everyone [blank2] to help clean up the mess in the kitchen.",
    options: ["party", "dinner", "volunteered", "refused"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "party",
      blank2: "volunteered",
    },
  },
  {
    id: 9,
    text: "The [blank1] of the story was [blank2] and left everyone in tears.",
    options: ["ending", "beginning", "sad", "happy"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "ending",
      blank2: "sad",
    },
  },
  {
    id: 10,
    text: "Despite the [blank1], they managed to [blank2] the project on time.",
    options: ["challenges", "difficulties", "complete", "finish"],
    blanks: ["blank1", "blank2"],
    correctAnswers: {
      blank1: "challenges",
      blank2: "complete",
    },
  },
];

type AppScreen = "start" | "question" | "results";

/// state management
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);

  const handleStartQuiz = () => {
    setCurrentScreen("question");
    // reset
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
  };
  const handleNextQuestion = (answers: Record<string, string>) => {
    const question = questions[currentQuestionIndex];

    // all blanks are matching answers, then passed
    const isCorrect = Object.entries(answers).every(
      ([blank, answer]) => answer === question.correctAnswers[blank]
    );

    setUserAnswers([
      ...userAnswers,
      {
        questionId: question.id,
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

  return (
    <div>
      {currentScreen === "start" && <StartScreen onStart={handleStartQuiz} />}
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
