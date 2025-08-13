"use client"

import type React from "react"
import { useState } from "react"
import type { Task } from "./types" // Assuming Task type is defined elsewhere

const CommandDeckPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskHistory, setTaskHistory] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleSaveTask = (updatedTask: Task) => {
    console.log("Saving task:", updatedTask)

    if (updatedTask.status === "Done") {
      // Move to task history
      const historyTask = {
        ...updatedTask,
        status: "Completed" as const,
        completedAt: new Date().toISOString(),
      }

      setTaskHistory((prev) => {
        const updated = [historyTask, ...prev]
        console.log("Updated task history:", updated)
        return updated
      })

      // Remove from active tasks
      setTasks((prev) => {
        const updated = prev.filter((t) => t.id !== updatedTask.id)
        console.log("Updated active tasks:", updated)
        return updated
      })
    } else {
      // Update active task
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
    }

    setSelectedTask(null)
  }

  const getDefaultDeadline = (priority: string): string => {
    const now = new Date()
    switch (priority) {
      case "High":
        now.setDate(now.getDate() + 3)
        return now.toISOString().split("T")[0]
      case "Medium":
        now.setDate(now.getDate() + 7)
        return now.toISOString().split("T")[0]
      case "Low":
        now.setDate(now.getDate() + 14)
        return now.toISOString().split("T")[0]
      default:
        now.setDate(now.getDate() + 7)
        return now.toISOString().split("T")[0]
    }
  }

  // ** rest of code here **

  return <div>{/* Task list and other components */}</div>
}

export default CommandDeckPage
