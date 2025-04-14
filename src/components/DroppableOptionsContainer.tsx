import { useDroppable } from "@dnd-kit/core";

interface DroppableOptionsContainerProps {
  children: React.ReactNode;
  id: string;
  isActive: boolean;
}

export default function DroppableOptionsContainer({
  children,
  id,
  isActive,
}: DroppableOptionsContainerProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-wrap gap-2 justify-center mb-12 p-2 rounded-lg ${
        isActive || isOver
          ? "bg-gray-100 border border-indigo-500"
          : "border border-transparent "
      } `}
    >
      {children}
    </div>
  );
}
