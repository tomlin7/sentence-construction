import DraggableOption from "@/components/DraggableOption";
import DroppableBlank from "@/components/DroppableBlank";
import DroppableOptionsContainer from "@/components/DroppableOptionsContainer";
import { Question } from "@/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onNext: (answers: string[]) => void;
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
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [availableOptions, setAvailableOptions] = useState<string[]>([
    ...question.options,
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overBlankId, setOverBlankId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAnswers([]);
    setTimeLeft(timeLimit);
    setAvailableOptions([...question.options]);
  }, [question, timeLimit]); // reset on question change

  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(String(active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    if (!over) {
      setOverBlankId(null);
      return;
    }

    const overId = String(over.id);

    if (overId.startsWith("blank-")) {
      const blankId = overId.replace("blank-", "");
      setOverBlankId(blankId);
    } else {
      setOverBlankId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverBlankId(null);

    if (!active || !over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith("option-") && overId.startsWith("blank-")) {
      // options to blanks
      const word = activeId.replace("option-", "");
      const position = parseInt(overId.replace("blank-", ""));
      handleSelectWord(word, position);
    } else if (
      activeId.startsWith("blank-") &&
      overId === "options-container"
    ) {
      // blanks to options back
      const position = parseInt(activeId.replace("blank-", ""));
      handleRemoveWord(position);
    } else if (activeId.startsWith("blank-") && overId.startsWith("blank-")) {
      // dragging between blanks to swap
      const sourcePosition = parseInt(activeId.replace("blank-", ""));
      const targetPosition = parseInt(overId.replace("blank-", ""));

      if (
        selectedAnswers[sourcePosition] &&
        sourcePosition !== targetPosition
      ) {
        const word = selectedAnswers[sourcePosition];
        const newAnswers = [...selectedAnswers];

        if (newAnswers[targetPosition]) {
          newAnswers[sourcePosition] = newAnswers[targetPosition];
        } else {
          delete newAnswers[sourcePosition];
        }

        newAnswers[targetPosition] = word;
        setSelectedAnswers(newAnswers);
      }
    }
  };

  const handleSelectWord = (word: string, position: number) => {
    if (selectedAnswers[position]) {
      setAvailableOptions((prev) => [...prev, selectedAnswers[position]]);
    }

    const newAnswers = [...selectedAnswers];
    newAnswers[position] = word;
    setSelectedAnswers(newAnswers);
    setAvailableOptions((prev) => prev.filter((option) => option !== word));
  };

  const handleRemoveWord = (position: number) => {
    if (!selectedAnswers[position]) return;

    setAvailableOptions((prev) => [...prev, selectedAnswers[position]]);
    const newAnswers = [...selectedAnswers];
    delete newAnswers[position];
    setSelectedAnswers(newAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getBlanks = () => {
    return question.question.split("_____________").length - 1;
  };

  const allBlanksFilled =
    selectedAnswers.length === getBlanks() &&
    selectedAnswers.every((answer) => answer !== undefined);

  const handleNext = useCallback(() => {
    if (!allBlanksFilled) {
      const newAnswers = [...selectedAnswers];
      const emptyPositions = Array.from(
        { length: getBlanks() },
        (_, i) => i
      ).filter((i) => !newAnswers[i]);

      emptyPositions.forEach((position, index) => {
        if (index < availableOptions.length) {
          newAnswers[position] = availableOptions[index];
        }
      });

      onNext(newAnswers);
    } else {
      onNext(selectedAnswers);
    }
  }, [selectedAnswers, availableOptions, allBlanksFilled, onNext]);

  const renderQuestionText = () => {
    const parts = question.question.split("_____________");

    return parts.map((part, index) => {
      if (index === parts.length - 1) {
        return <span key={index}>{part}</span>;
      }

      const droppableId = `blank-${index}`;
      const selectedWord = selectedAnswers[index];
      const isOver = overBlankId === String(index);

      return (
        <span key={index}>
          {part}
          <DroppableBlank
            id={droppableId}
            blank={String(index)}
            selectedWord={selectedWord}
            onRemove={handleRemoveWord}
            isOver={isOver}
          />
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-40 py-20">
      <main className="flex-1 flex flex-col shadow-2xl/20 rounded-3xl p-5">
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

          <div className="flex-1 max-w-3xl mx-auto px-4 py-8 flex flex-col justify-center items-center">
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
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!allBlanksFilled}
              className={`p-3 m-3 rounded-lg ${
                allBlanksFilled
                  ? "bg-indigo-600 text-white hover:bg-indigo-600/90"
                  : "border border-gray-100 text-gray-300 hover:bg-gray-100"
              }`}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </DndContext>
      </main>
    </div>
  );
}
