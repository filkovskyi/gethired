import React from "react";
import { DroppableColumn } from "./DroppableColumn";
import { Column } from "@/lib/types";

interface KanbanBoardProps {
  columns: Column[];
  moveVacancy: (id: string, targetColumnId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  moveVacancy,
}) => {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <DroppableColumn
          key={column.id}
          column={column}
          moveVacancy={moveVacancy}
        />
      ))}
    </div>
  );
};
