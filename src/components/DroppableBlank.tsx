import { useDroppable } from "@dnd-kit/core";

interface DroppableBlankProps {
  id: string;
  blank: string;
  selectedWord?: string;
  onRemove: (position: number) => void;
  isOver: boolean;
}

export default function DroppableBlank({
  id,
  blank,
  selectedWord,
  onRemove,
  isOver,
}: DroppableBlankProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      id={id}
      data-blank-id={blank}
      onClick={() => selectedWord && onRemove(parseInt(blank))}
      className={`inline-block min-w-[100px] px-2 py-1 mx-1 border-2 ${
        isOver
          ? "bg-gray-100 border-dashed border-indigo-500 shadow-md transform scale-105 transition-all duration-100"
          : selectedWord
          ? "bg-gray-100 border-indigo-500"
          : "border-dashed border-gray-400"
      }`}
    >
      {selectedWord || "_____"}
    </div>
  );
}
