import { useDroppable } from "@dnd-kit/core";

interface DroppableBlankProps {
  id: string;
  blank: string;
  selectedWord?: string;
  onRemove: (blank: string) => void;
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
      onClick={() => selectedWord && onRemove(blank)}
      className={`inline-block min-w-[100px] px-2 py-1 mx-1 border-2`}
    >
      {selectedWord || "_____"}
    </div>
  );
}
