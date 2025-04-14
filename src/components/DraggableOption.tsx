import { useDraggable } from "@dnd-kit/core";

interface DraggableOptionProps {
  id: string;
  option: string;
  isDragging: boolean;
}

export default function DraggableOption({
  id,
  option,
  isDragging,
}: DraggableOptionProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(-3deg)`,
        zIndex: isDragging ? 1000 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`inline-block px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100
        ${isDragging ? "shadow-lg opacity-90" : "hover:shadow-md/5"}
        cursor-grab active:cursor-grabbing transition-all duration-75`}
    >
      {option}
    </div>
  );
}
