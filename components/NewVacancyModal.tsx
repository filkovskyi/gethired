import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Vacancy } from "@/lib/types";

interface NewVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vacancy: Omit<Vacancy, "id" | "stage">) => void;
}

export const NewVacancyModal: React.FC<NewVacancyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [newVacancy, setNewVacancy] = useState<Omit<Vacancy, "id" | "stage">>({
    title: "",
    source: "custom",
    url: "",
    description: "",
    salary: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewVacancy((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newVacancy);
    setNewVacancy({
      title: "",
      source: "custom",
      url: "",
      description: "",
      salary: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Vacancy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Title"
            value={newVacancy.title}
            onChange={handleInputChange}
            required
          />
          <Select
            name="source"
            value={newVacancy.source}
            onValueChange={(value) =>
              handleInputChange({ target: { name: "source", value } } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dou">DOU</SelectItem>
              <SelectItem value="djinni">Djinni</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="url"
            placeholder="URL"
            value={newVacancy.url}
            onChange={handleInputChange}
            required
          />
          <Input
            name="salary"
            type="number"
            placeholder="Salary"
            value={newVacancy.salary}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newVacancy.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <Button type="submit">Add Vacancy</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
