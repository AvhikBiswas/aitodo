"use client"

import { useState, useEffect } from "react"
import { Resizable } from "re-resizable"
import { ArrowUpWideNarrowIcon as ArrowsHorizontal } from "lucide-react"
import AIChatSection from "./AIChatSection"
import TaskSection from "./TaskSection"
import { Card } from "@/components/ui/card"
import { Task } from "../types/task"
import { UserButton } from "@clerk/nextjs"

export default function Layout() {
  const [width, setWidth] = useState("50%")
  const [isResizing, setIsResizing] = useState(false)
  const [aiGeneratedTasks, setAiGeneratedTasks] = useState<Task[]>([])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWidth("100%")
      } else {
        setWidth("50%")
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleTasksGenerated = (tasks: Task[]) => {
    setAiGeneratedTasks(tasks)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">AI Task Manager</h1>
            </div>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden">
        <div className="flex h-[calc(100vh-4rem)]">
          <Resizable
            size={{ width, height: "100%" }}
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={(e, direction, ref, d) => {
              setIsResizing(false)
              setWidth(`${Number.parseFloat(width) + d.width}px`)
            }}
            minWidth="320px"
            maxWidth="calc(100% - 320px)"
            enable={{ right: true }}
          >
            <Card className="h-full overflow-hidden rounded-none border-r">
              <AIChatSection onTasksGenerated={handleTasksGenerated} />
            </Card>
          </Resizable>
          <div
            className={`flex items-center justify-center w-1 bg-gray-200 cursor-col-resize hover:bg-blue-500 transition-colors ${
              isResizing ? "bg-blue-500" : ""
            }`}
          >
            <ArrowsHorizontal className="text-gray-500" size={16} />
          </div>
          <div className="flex-1 overflow-hidden">
            <Card className="h-full overflow-hidden rounded-none">
              <TaskSection aiGeneratedTasks={aiGeneratedTasks} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
