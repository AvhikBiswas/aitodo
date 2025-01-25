"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Edit2, Trash2, Check } from "lucide-react"

type Task = {
  id: number
  text: string
  completed: boolean
  priority: number
  timestamp: Date
}

export default function TaskSection() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [previousTasks, setPreviousTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newPriority, setNewPriority] = useState(5)
  const [editingTask, setEditingTask] = useState<number | null>(null)

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: newPriority,
        timestamp: new Date(),
      }
      setTasks((prev) => [...prev, task])
      setNewTask("")
      setNewPriority(5)
    }
  }

  const toggleTask = (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      const updatedTask = { ...task, completed: !task.completed }
      setTasks(tasks.filter((t) => t.id !== id))
      setCompletedTasks((prev) => [...prev, updatedTask])
    }
  }

  const editTask = (id: number, newText: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)))
    setEditingTask(null)
  }

  const deleteTask = (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      setTasks(tasks.filter((t) => t.id !== id))
      setPreviousTasks((prev) => [...prev, task])
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTasks(items)
  }

  const renderTask = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg mb-2"
        >
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            className="rounded-full"
          />
          {editingTask === task.id ? (
            <Input
              value={task.text}
              onChange={(e) => editTask(task.id, e.target.value)}
              onBlur={() => setEditingTask(null)}
              autoFocus
            />
          ) : (
            <label
              htmlFor={`task-${task.id}`}
              className={`flex-1 ${task.completed ? "line-through text-gray-500" : ""}`}
            >
              {task.text}
            </label>
          )}
          <span className="text-sm text-gray-500">Priority: {task.priority}</span>
          <span className="text-sm text-gray-500">{format(task.timestamp, "MM/dd/yyyy HH:mm")}</span>
          <Button variant="ghost" size="icon" onClick={() => setEditingTask(task.id)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      )}
    </Draggable>
  )

  return (
    <div className="h-full bg-white shadow-lg p-6 overflow-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
      </div>
      <div className="flex space-x-2 mb-4">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <Input
          type="number"
          min="1"
          max="10"
          value={newPriority}
          onChange={(e) => setNewPriority(Number(e.target.value))}
          className="w-20"
        />
        <Button onClick={addTask}>Add</Button>
      </div>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="previous">Previous</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => renderTask(task, index))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </TabsContent>
        <TabsContent value="completed">
          <ul>
            {completedTasks.map((task) => (
              <li key={task.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg mb-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="line-through text-gray-500">{task.text}</span>
                <span className="text-sm text-gray-500">
                  Completed on: {format(task.timestamp, "MM/dd/yyyy HH:mm")}
                </span>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="previous">
          <ul>
            {previousTasks.map((task) => (
              <li key={task.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg mb-2">
                <span className="text-gray-500">{task.text}</span>
                <span className="text-sm text-gray-500">Deleted on: {format(task.timestamp, "MM/dd/yyyy HH:mm")}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}

