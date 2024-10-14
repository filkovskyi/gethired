import React from "react";
import { DroppableColumn } from "./DroppableColumn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column } from "@/lib/types";

interface KanbanBoardProps {
  columns: Column[];
  moveVacancy: (id: string, targetColumnId: string) => void;
  selectedVariant: "simple" | "advanced" | "custom";
  onVariantChange: (value: "simple" | "advanced" | "custom") => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  moveVacancy,
  selectedVariant,
  onVariantChange,
}) => {
  return (
    <div>
      <div className="mb-4">
        <Select value={selectedVariant} onValueChange={onVariantChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            moveVacancy={moveVacancy}
          />
        ))}
      </div>
    </div>
  );
};
