import React from "react";
import { useDrop } from "react-dnd";
import { DraggableVacancy } from "@/components/DraggableVacancy";
import { Column, ItemTypes } from "@/lib/types";

interface DroppableColumnProps {
  column: Column;
  moveVacancy: (id: string, targetColumnId: string) => void;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({
  column,
  moveVacancy,
}) => {
  const [, drop] = useDrop({
    accept: ItemTypes.VACANCY,
    drop: (item: { id: string; index: number }) => {
      moveVacancy(item.id, column.id);
    },
  });

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className="bg-gray-100 p-4 rounded-lg min-w-[250px]"
    >
      <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
      <div className="min-h-[200px]">
        {column.vacancies.map((vacancy, index) => (
          <DraggableVacancy key={vacancy.id} vacancy={vacancy} index={index} />
        ))}
      </div>
    </div>
  );
};
