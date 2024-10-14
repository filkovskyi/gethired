"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanBoard } from "@/components/KanbanBoard";
import { NewVacancyModal } from "@/components/NewVacancyModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Column, Vacancy, initialColumns } from "@/lib/types";
import {
  fetchVacancies,
  addVacancy,
  updateVacancy,
} from "@/lib/supabaseClient";

export default function VacancyKanbanDashboard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isNewVacancyModalOpen, setIsNewVacancyModalOpen] = useState(false);

  useEffect(() => {
    const loadVacancies = async () => {
      const vacancies = await fetchVacancies();
      const updatedColumns = initialColumns.map((column) => ({
        ...column,
        vacancies: vacancies.filter(
          (vacancy) => vacancy.column_id === column.id
        ),
      }));
      setColumns(updatedColumns);
    };

    loadVacancies();
  }, []);

  const moveVacancy = useCallback(
    async (vacancyId: string, targetColumnId: string) => {
      const updatedColumns = columns.map((col) => ({
        ...col,
        vacancies: [...col.vacancies],
      }));

      let movedVacancy: Vacancy | undefined;

      for (const column of updatedColumns) {
        const vacancyIndex = column.vacancies.findIndex(
          (v) => v.id === vacancyId
        );
        if (vacancyIndex !== -1) {
          [movedVacancy] = column.vacancies.splice(vacancyIndex, 1);
          break;
        }
      }

      if (movedVacancy) {
        const targetColumn = updatedColumns.find(
          (col) => col.id === targetColumnId
        );
        if (targetColumn) {
          movedVacancy.column_id = targetColumnId;
          targetColumn.vacancies.push(movedVacancy);
          await updateVacancy(movedVacancy);
        }
      }

      setColumns(updatedColumns);
    },
    [columns]
  );

  const handleAddVacancy = useCallback(
    async (newVacancy: Omit<Vacancy, "id" | "stage" | "column_id">) => {
      const vacancy = await addVacancy({
        ...newVacancy,
        stage: "heap",
        column_id: columns[0].id,
      });

      if (vacancy) {
        setColumns((prevColumns) => {
          const newColumns = [...prevColumns];
          newColumns[0].vacancies.push(vacancy);
          return newColumns;
        });
      }

      setIsNewVacancyModalOpen(false);
    },
    [columns]
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
        <KanbanBoard columns={columns} moveVacancy={moveVacancy} />
        <NewVacancyModal
          isOpen={isNewVacancyModalOpen}
          onClose={() => setIsNewVacancyModalOpen(false)}
          onSubmit={handleAddVacancy}
        />
      </div>
    </DndProvider>
  );
}
