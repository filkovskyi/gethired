import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vacancy } from "@/lib/types";

interface VacancyDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  vacancy: Vacancy
}

export const VacancyDetailsModal: React.FC<VacancyDetailsModalProps> = ({
  isOpen,
  onClose,
  vacancy,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vacancy.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Source:</strong> {vacancy.source}</p>
          <p><strong>URL:</strong> <a href={vacancy.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{vacancy.url}</a></p>
          <p><strong>Description:</strong> {vacancy.description}</p>
          <p><strong>Salary:</strong> ${vacancy.salary}</p>
          <p><strong>Stage:</strong> {vacancy.stage}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}