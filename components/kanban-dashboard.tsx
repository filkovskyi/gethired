'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PlusCircle, X, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

type Task = {
  id: string
  content: string
}

type Column = {
  id: string
  title: string
  tasks: Task[]
}

export default function KanbanDashboard() {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'col1', title: 'To Do', tasks: [{ id: 'task1', content: 'Task 1' }] },
    { id: 'col2', title: 'In Progress', tasks: [] },
    { id: 'col3', title: 'Done', tasks: [] },
  ])
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  const [newTaskContent, setNewTaskContent] = useState<string>('')

  const onDragEnd = (result: any) => {
    const { source, destination } = result
    if (!destination) return

    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)
    
    if (sourceColumn && destColumn) {
      const sourceTasks = Array.from(sourceColumn.tasks)
      const destTasks = source.droppableId === destination.droppableId ? sourceTasks : Array.from(destColumn.tasks)
      const [removed] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, removed)

      const newColumns = columns.map(col => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks }
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks }
        }
        return col
      })

      setColumns(newColumns)
    }
  }

  const addColumn = () => {
    if (newColumnTitle.trim() !== '') {
      setColumns([...columns, { id: `col${columns.length + 1}`, title: newColumnTitle, tasks: [] }])
      setNewColumnTitle('')
    }
  }

  const removeColumn = (columnId: string) => {
    setColumns(columns.filter(col => col.id !== columnId))
  }

  const startEditingColumn = (columnId: string) => {
    setEditingColumn(columnId)
  }

  const finishEditingColumn = (columnId: string, newTitle: string) => {
    setColumns(columns.map(col => col.id === columnId ? { ...col, title: newTitle } : col))
    setEditingColumn(null)
  }

  const addTask = (columnId: string) => {
    if (newTaskContent.trim() !== '') {
      setColumns(columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, { id: `task${Date.now()}`, content: newTaskContent }]
          }
        }
        return col
      }))
      setNewTaskContent('')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Dashboard</h1>
      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          placeholder="New column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={addColumn}>Add Column</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-100 p-4 rounded-lg min-w-[250px]">
              <div className="flex justify-between items-center mb-2">
                {editingColumn === column.id ? (
                  <Input
                    type="text"
                    value={column.title}
                    onChange={(e) => finishEditingColumn(column.id, e.target.value)}
                    onBlur={() => setEditingColumn(null)}
                    autoFocus
                  />
                ) : (
                  <h2 className="text-lg font-semibold">{column.title}</h2>
                )}
                <div>
                  <Button variant="ghost" size="icon" onClick={() => startEditingColumn(column.id)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeColumn(column.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px]">
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <CardContent className="p-2">
                              {task.content}
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="New task"
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={() => addTask(column.id)} className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Task
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}