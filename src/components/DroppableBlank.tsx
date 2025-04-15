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
      className={`inline-block min-w-[90px] md:min-w-[120px] px-2 md:px-3 py-1 md:py-2 mx-1 md:mx-2 border-2 text-sm md:text-base 
        ${
          isOver
            ? "bg-gray-100 border-dashed border-indigo-500 shadow-md transform scale-110 transition-all duration-100"
            : selectedWord
            ? "bg-gray-100 border-indigo-500 hover:shadow-sm"
            : "border-dashed border-gray-400 hover:border-gray-500"
        }
        cursor-pointer touch-manipulation`}
    >
      {selectedWord || "_____"}
    </div>
  );
}
