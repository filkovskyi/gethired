"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Vacancy = {
  id: string;
  content: string;
};

type Column = {
  id: string;
  title: string;
  vacancies: Vacancy[];
};

const ItemTypes = {
  VACANCY: "vacancy" as const,
};

const createVacancy = (
  columnId: string,
  index: number,
  content: string
): Vacancy => ({
  id: `${columnId}-vacancy-${index}`,
  content,
});

const initialColumnVariants = {
  simple: [
    {
      id: "col1",
      title: "Heap",
      vacancies: [
        createVacancy("col1", 0, "Frontend Developer"),
        createVacancy("col1", 1, "Backend Developer"),
        createVacancy("col1", 2, "UX Designer"),
      ],
    },
    { id: "col2", title: "Interview", vacancies: [] },
    { id: "col3", title: "Done", vacancies: [] },
  ],
  advanced: [
    {
      id: "col1",
      title: "Heap",
      vacancies: [
        createVacancy("col1", 0, "Senior React Developer"),
        createVacancy("col1", 1, "DevOps Engineer"),
        createVacancy("col1", 2, "Product Manager"),
        createVacancy("col1", 3, "Data Scientist"),
      ],
    },
    { id: "col2", title: "HR Screening", vacancies: [] },
    { id: "col3", title: "Tech Screening", vacancies: [] },
    { id: "col4", title: "Manager Screening", vacancies: [] },
    { id: "col5", title: "Done", vacancies: [] },
  ],
  custom: [] as Column[],
};

interface DraggableVacancyProps {
  vacancy: Vacancy;
  index: number;
  moveVacancy: (id: string, targetColumnId: string) => void;
}

const DraggableVacancy: React.FC<DraggableVacancyProps> = ({
  vacancy,
  index,
}) => {
  const dragRef = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.VACANCY,
    item: { id: vacancy.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(dragRef);
  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "move" : "pointer",
      }}
    >
      <Card className="mb-2">
        <CardContent className="p-2">{vacancy.content}</CardContent>
      </Card>
    </div>
  );
};

interface DroppableColumnProps {
  column: Column;
  moveVacancy: (id: string, targetColumnId: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
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
    <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className="bg-gray-100 p-4 rounded-lg min-w-[250px]">
      <h2 className="text-lg font-semibold mb-2">{column.title}</h2>
      <div className="min-h-[200px]">
        {column.vacancies.map((vacancy, index) => (
          <DraggableVacancy
            key={vacancy.id}
            vacancy={vacancy}
            index={index}
            moveVacancy={moveVacancy}
          />
        ))}
      </div>
    </div>
  );
};

export default function VacancyKanbanDashboard() {
  const [columns, setColumns] = useState<Column[]>(
    initialColumnVariants.simple
  );
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newVacancyContent, setNewVacancyContent] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<
    "simple" | "advanced" | "custom"
  >("simple");

  const regenerateVacancyIds = useCallback((cols: Column[]): Column[] => {
    return cols.map((column) => ({
      ...column,
      vacancies: column.vacancies.map((vacancy, index) => ({
        ...vacancy,
        id: `${column.id}-vacancy-${index}`,
      })),
    }));
  }, []);

  useEffect(() => {
    setColumns(regenerateVacancyIds(columns));
  }, [regenerateVacancyIds]);

  const moveVacancy = useCallback(
    (vacancyId: string, targetColumnId: string) => {
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col) => ({
          ...col,
          vacancies: [...col.vacancies],
        }));
        const sourceColumn = newColumns.find((col) =>
          col.vacancies.some((v) => v.id === vacancyId)
        );
        const targetColumn = newColumns.find(
          (col) => col.id === targetColumnId
        );

        if (sourceColumn && targetColumn) {
          const vacancyIndex = sourceColumn.vacancies.findIndex(
            (v) => v.id === vacancyId
          );
          const [vacancy] = sourceColumn.vacancies.splice(vacancyIndex, 1);
          targetColumn.vacancies.push(vacancy);
        }

        return regenerateVacancyIds(newColumns);
      });
    },
    [regenerateVacancyIds]
  );

  const addColumn = useCallback(() => {
    if (newColumnTitle.trim() !== "") {
      const newColumnId = `col${columns.length + 1}`;
      setColumns((prevColumns) =>
        regenerateVacancyIds([
          ...prevColumns,
          { id: newColumnId, title: newColumnTitle, vacancies: [] },
        ])
      );
      setNewColumnTitle("");
      setSelectedVariant("custom");
    }
  }, [newColumnTitle, columns.length, regenerateVacancyIds]);

  const addVacancy = useCallback(() => {
    if (newVacancyContent.trim() !== "") {
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col, colIndex) => {
          if (colIndex === 0) {
            // Add to the first column (Heap)
            return {
              ...col,
              vacancies: [
                ...col.vacancies,
                {
                  id: `${col.id}-vacancy-${col.vacancies.length}`,
                  content: newVacancyContent,
                },
              ],
            };
          }
          return col;
        });
        return regenerateVacancyIds(newColumns);
      });
      setNewVacancyContent("");
    }
  }, [newVacancyContent, regenerateVacancyIds]);

  const handleVariantChange = useCallback(
    (value: string) => {
      setSelectedVariant(value as "simple" | "advanced" | "custom");
      if (value === "simple" || value === "advanced") {
        setColumns(
          regenerateVacancyIds(
            initialColumnVariants[value as "simple" | "advanced"]
          )
        );
      }
    },
    [regenerateVacancyIds]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Vacancy Kanban Dashboard</h1>
        <div className="flex flex-col space-y-4 mb-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-grow flex space-x-2">
            <Select value={selectedVariant} onValueChange={handleVariantChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="New column title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={addColumn}>Add Column</Button>
          </div>
          <div className="flex-grow flex space-x-2">
            <Input
              type="text"
              placeholder="New vacancy"
              value={newVacancyContent}
              onChange={(e) => setNewVacancyContent(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={addVacancy}>
              <PlusCircle className="h-4 w-4 mr-2" /> Add Vacancy
            </Button>
          </div>
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
    </DndProvider>
  );
}
