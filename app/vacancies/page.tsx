"use client";

import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanBoard } from "@/components/KanbanBoard";
import { NewVacancyModal } from "@/components/NewVacancyModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { initialColumnVariants, Column, Vacancy } from "@/lib/types";

export default function VacanciesPage() {
  const [columns, setColumns] = useState<Column[]>(
    initialColumnVariants.advanced as Column[]
  );
  const [selectedVariant, setSelectedVariant] = useState<
    "simple" | "advanced" | "custom"
  >("advanced");
  const [isNewVacancyModalOpen, setIsNewVacancyModalOpen] = useState(false);

  const regenerateVacancyIds = useCallback((cols: Column[]): Column[] => {
    return cols.map((column) => ({
      ...column,
      vacancies: column.vacancies.map((vacancy, index) => ({
        ...vacancy,
        id: `${column.id}-vacancy-${index}`,
      })),
    }));
  }, []);

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

  const addVacancy = useCallback(
    (newVacancy: Omit<Vacancy, "id" | "stage">) => {
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col, colIndex) => {
          if (colIndex === 0) {
            return {
              ...col,
              vacancies: [
                ...col.vacancies,
                {
                  ...newVacancy,
                  id: `${col.id}-vacancy-${col.vacancies.length}`,
                  stage: "heap",
                },
              ],
            };
          }
          return col;
        });
        const updatedColumns = regenerateVacancyIds(newColumns as Column[]);
        return updatedColumns;
      });
      setIsNewVacancyModalOpen(false);
    },
    [regenerateVacancyIds]
  );

  const handleVariantChange = useCallback(
    (value: "simple" | "advanced" | "custom") => {
      setSelectedVariant(value);
      if (value === "simple" || value === "advanced") {
        setColumns(regenerateVacancyIds(initialColumnVariants[value] as Column[]));
      }
    },
    [regenerateVacancyIds]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Vacancy Kanban Dashboard</h1>
        <div className="flex justify-between mb-4">
          <Button onClick={() => setIsNewVacancyModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> New Vacancy
          </Button>
        </div>
        <KanbanBoard
          columns={columns}
          moveVacancy={moveVacancy}
          selectedVariant={selectedVariant}
          onVariantChange={handleVariantChange}
        />
        <NewVacancyModal
          isOpen={isNewVacancyModalOpen}
          onClose={() => setIsNewVacancyModalOpen(false)}
          onSubmit={addVacancy}
        />
      </div>
    </DndProvider>
  );
}
