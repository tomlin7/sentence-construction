import DraggableOption from "@/components/DraggableOption";
import DroppableBlank from "@/components/DroppableBlank";
import DroppableOptionsContainer from "@/components/DroppableOptionsContainer";
import { Question } from "@/lib/types";
import { DndContext, pointerWithin } from "@dnd-kit/core";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [availableOptions, setAvailableOptions] = useState<string[]>([
    ...question.options,
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overBlankId, setOverBlankId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAnswers({});
    setTimeLeft(timeLeft);
    setAvailableOptions([...question.options]);
  }, [question, timeLimit]);

  const handleDragStart = () => {};
  const handleDragOver = () => {};
  const handleDragEnd = () => {};

  const handleSelectWord = (word: string, blank: string) => {};
  const handleRemoveWord = (blank: string) => {};

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const allBlanksFilled = question.blanks.every(
    (blank) => selectedAnswers[blank]
  );

  const handleNext = useCallback(() => {
    if (!allBlanksFilled) {
      const newAnswers = { ...selectedAnswers };
      const emptyBlanks = question.blanks.filter((blank) => !newAnswers[blank]);

      emptyBlanks.forEach((blank, index) => {
        if (index < availableOptions.length) {
          newAnswers[blank] = availableOptions[index];
        }
      });

      onNext(newAnswers);
    } else {
      onNext(selectedAnswers);
    }
  }, [
    selectedAnswers,
    question.blanks,
    availableOptions,
    allBlanksFilled,
    onNext,
  ]);

  const renderQuestionText = () => {
    const parts = question.text.split(/(\[blank\d+\])/g);

    return parts.map((part, index) => {
      const blankMatch = part.match(/\[blank(\d+)\]/);

      if (blankMatch) {
        const blankId = `blank${blankMatch[1]}`;
        const selectedWord = selectedAnswers[blankId];
        const droppableId = `blank-${blankId}`;
        const isOver = overBlankId === blankId;

        return (
          <DroppableBlank
            key={index}
            id={droppableId}
            blank={blankId}
            selectedWord={selectedWord}
            onRemove={handleRemoveWord}
            isOver={isOver}
          />
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-40 py-20">
      <div className="flex flex-col shadow-3xl/10 rounded-3xl">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          collisionDetection={pointerWithin}
        >
          <header className="p-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-black">
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={onQuit}
              className="px-4 py-2 border border-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
            >
              Quit
            </button>
          </header>

          {/* progress */}
          <div className="flex px-4 mb-8">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 mx-0.5 rounded-full ${
                  index < questionNumber ? "bg-amber-300" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          <main className="flex-1 max-w-3xl mx-auto px-4 py-8 flex flex-col">
            <h2 className="text-xl text-center text-gray-600 mb-12">
              Select the missing words in the correct order
            </h2>

            <div className="text-lg mb-12 leading-relaxed">
              {renderQuestionText()}
            </div>

            <DroppableOptionsContainer
              id="options-container"
              isActive={activeId?.startsWith("blank-") || false}
            >
              {availableOptions.map((option) => {
                const optionId = `option-${option}`;
                const isActive = activeId === optionId;

                return (
                  <DraggableOption
                    key={optionId}
                    id={optionId}
                    option={option}
                    isDragging={isActive}
                  />
                );
              })}
            </DroppableOptionsContainer>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!allBlanksFilled}
                className={`p-3 rounded-lg`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </main>
        </DndContext>
      </div>
    </div>
  );
}
