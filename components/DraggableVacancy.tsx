import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Vacancy, ItemTypes } from "@/lib/types";
import { VacancyDetailsModal } from "@/components/VacancyDetailsModal";

interface DraggableVacancyProps {
  vacancy: Vacancy;
  index: number;
}

export const DraggableVacancy: React.FC<DraggableVacancyProps> = ({
  vacancy,
  index,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <>
      <div
        ref={dragRef}
        onClick={() => setIsModalOpen(true)}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: isDragging ? "move" : "pointer",
        }}
      >
        <Card className="mb-2">
          <CardContent className="p-2">
            <h3 className="font-semibold">{vacancy.title}</h3>
            <p className="text-sm text-gray-600">Source: {vacancy.source}</p>
            <p className="text-sm text-gray-600">Salary: ${vacancy.salary}</p>
          </CardContent>
        </Card>
      </div>
      <VacancyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vacancy={vacancy}
      />
    </>
  );
};
