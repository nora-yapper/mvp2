"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Loader2, AlertCircle } from "lucide-react"

// import { checkTokenBalance } from "@/lib/token-integration"

interface Task {
  id: string
  title: string
  description: string
  assignee: string[]
  deadline: string
  priority: "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Done"
  category: string[]
  createdAt: string
  deletedAt?: string
}

interface GeneratedStep {
  title: string
  description: string
  assignee: string[]
  deadline: string
  priority: "High" | "Medium" | "Low"
  category: string[]
}

interface TeamMemberWorkload {
  name: string
  workload: number
  status: "Underloaded" | "Balanced" | "Overloaded"
}

const teamMembers = [
  { id: "1", name: "Sarah Chen", role: "Product Manager" },
  { id: "2", name: "Alex Johnson", role: "Developer" },
  { id: "3", name: "Mike Rodriguez", role: "Designer" },
  { id: "4", name: "Emily Davis", role: "Marketing" },
  { id: "5", name: "James Wilson", role: "Sales" },
]

const departmentOptions = [
  "Product Development",
  "Sales",
  "Marketing",
  "Finance",
  "Operations",
  "Human Resources",
  "Legal",
  "Research & Development",
]

export default function CommandDeck() {
  const [activeView, setActiveView] = useState("Gantt")
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Define Features of MVP",
      description:
        "Identify and list down the 5-7 key features that your MVP must have to solve the problem it is designed for. Use tools like Trello or Asana for task management.",
      assignee: ["Alex Johnson"],
      deadline: "2025-09-30",
      priority: "High",
      status: "To Do",
      category: ["Product Development"], // Changed from Mission Critical
      createdAt: "2025-01-16",
    },
    {
      id: "2",
      title: "Sketch UI/UX Wireframes",
      description:
        "Create detailed wireframes for your MVP using a tool like Sketch or Figma. Focus on user journey and functionality rather than aesthetics at this stage.",
      assignee: ["Emily Davis"],
      deadline: "2025-09-23",
      priority: "High",
      status: "To Do",
      category: ["Product Development"], // Changed from Mission Critical
      createdAt: "2025-01-16",
    },
    {
      id: "3",
      title: "Develop MVP",
      description:
        "Start the development process of your MVP. Use agile methodologies to manage your development process and tools like GitHub for version control.",
      assignee: ["Alex Johnson"],
      deadline: "2025-09-30",
      priority: "High",
      status: "To Do",
      category: ["Product Development"], // Changed from Critical
      createdAt: "2025-01-16",
    },
    {
      id: "4",
      title: "Test MVP",
      description:
        "Once the MVP is ready, perform thorough testing. Use tools like Jira for bug tracking and managing testing workflows.",
      assignee: ["James Wilson"],
      deadline: "2025-09-30",
      priority: "Medium",
      status: "To Do",
      category: ["Product Development"], // Changed from Critical
      createdAt: "2025-01-16",
    },
    {
      id: "5",
      title: "Collect User Feedback",
      description: "Use tools like Google Forms or SurveyMonkey for collecting feedback.",
      assignee: ["James Wilson"],
      deadline: "2025-09-30",
      priority: "Medium",
      status: "To Do",
      category: ["Marketing"], // Changed from Critical
      createdAt: "2025-01-16",
    },
  ])
  const [taskHistory, setTaskHistory] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isTaskHistoryOpen, setIsTaskHistoryOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [mission, setMission] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const [accomplished, setAccomplished] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSteps, setGeneratedSteps] = useState<GeneratedStep[]>([])
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null)
  const [editingStep, setEditingStep] = useState<GeneratedStep | null>(null)
  const [apiSource, setApiSource] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: [] as string[],
    deadline: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    category: [] as string[],
  })

  // Use ref to track if we're loading from storage to prevent infinite loops
  const isLoadingFromStorage = useRef(false)

  // Mock team workload data
  const teamWorkload: TeamMemberWorkload[] = [
    { name: "Sarah Chen", workload: 45, status: "Underloaded" },
    { name: "Alex Johnson", workload: 75, status: "Balanced" },
    { name: "Mike Rodriguez", workload: 92, status: "Overloaded" },
    { name: "Emily Davis", workload: 68, status: "Balanced" },
    { name: "James Wilson", workload: 34, status: "Underloaded" },
  ]

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = localStorage.getItem("commandDeckTasks")
      const savedHistory = localStorage.getItem("commandDeckTaskHistory")

      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks)
          isLoadingFromStorage.current = true
          setTasks(parsedTasks)
          setTimeout(() => {
            isLoadingFromStorage.current = false
          }, 0)
        } catch (error) {
          console.error("Error parsing saved tasks:", error)
          isLoadingFromStorage.current = true
          setTasks([])
          setTimeout(() => {
            isLoadingFromStorage.current = false
          }, 0)
        }
      }

      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory)
          setTaskHistory(parsedHistory)
        } catch (error) {
          console.error("Error parsing saved task history:", error)
          setTaskHistory([])
        }
      }
    }

    loadTasks()

    // Listen for storage changes (from forecast page implementations)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "commandDeckTasks") {
        loadTasks()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Save tasks to localStorage whenever tasks change (but not when loading from storage)
  useEffect(() => {
    if (!isLoadingFromStorage.current && tasks.length >= 0) {
      localStorage.setItem("commandDeckTasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Save task history to localStorage
  useEffect(() => {
    localStorage.setItem("commandDeckTaskHistory", JSON.stringify(taskHistory))
  }, [taskHistory])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleAddTask = () => {
    if (newTask.title && newTask.assignee && newTask.deadline) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        deadline: newTask.deadline,
        priority: newTask.priority,
        status: "To Do",
        category: newTask.category,
        createdAt: new Date().toISOString(),
      }
      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        assignee: [] as string[],
        deadline: "",
        priority: "Medium",
        category: [] as string[],
      })
      setIsAddTaskOpen(false)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setEditingTask({
      ...task,
      assignee: Array.isArray(task.assignee) ? task.assignee : [task.assignee],
      category: Array.isArray(task.category) ? task.category : [task.category],
    })
    setIsTaskDetailOpen(true)
  }

  const handleSaveTask = () => {
    if (editingTask) {
      if (editingTask.status === "Done") {
        // Move to task history
        const historyTask = {
          ...editingTask,
          deletedAt: new Date().toISOString(),
        }
        setTaskHistory([...taskHistory, historyTask])
        setTasks(tasks.filter((task) => task.id !== editingTask.id))
      } else {
        setTasks(tasks.map((task) => (task.id === editingTask.id ? editingTask : task)))
      }
      setIsTaskDetailOpen(false)
      setSelectedTask(null)
      setEditingTask(null)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId)
    if (taskToDelete) {
      const deletedTask = {
        ...taskToDelete,
        deletedAt: new Date().toISOString(),
        status: "Done" as const,
      }
      setTaskHistory([...taskHistory, deletedTask])
      setTasks(tasks.filter((task) => task.id !== taskId))
      setIsTaskDetailOpen(false)
      setSelectedTask(null)
      setEditingTask(null)
    }
  }

  const handleRestoreTask = (taskId: string) => {
    const taskToRestore = taskHistory.find((task) => task.id === taskId)
    if (taskToRestore) {
      const restoredTask = {
        ...taskToRestore,
        deletedAt: undefined,
        status: "To Do" as const,
      }
      setTasks([...tasks, restoredTask])
      setTaskHistory(taskHistory.filter((task) => task.id !== taskId))
    }
  }

  const handleGenerateMissionSteps = async () => {
    if (!mission.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-mission-steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mission: mission.trim(),
          timeframe: timeframe || undefined,
          accomplished: accomplished.split("\n").filter((item) => item.trim()),
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        setErrorMessage(`Error generating mission steps: ${errorData.error || `HTTP ${response.status}`}`)

        setTimeout(() => {
          setErrorMessage("")
        }, 5000)
        return
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (!data.steps || !Array.isArray(data.steps)) {
        throw new Error("Invalid response format: missing steps array")
      }

      const transformedSteps = data.steps.map((step: any, index: number) => {
        const getSmartAssignee = (category: string): string => {
          switch (category) {
            case "Product Development":
              return "Alex Johnson" // Developer
            case "Sales":
              return "James Wilson" // Sales
            case "Marketing":
              return "Emily Davis" // Marketing
            case "Research":
              return "Sarah Chen" // Product Manager
            case "Finance":
              return "Sarah Chen" // Product Manager
            case "Operations":
              return "Sarah Chen" // Product Manager
            case "Human Resources":
              return "Sarah Chen" // Product Manager
            case "Legal":
              return "Sarah Chen" // Product Manager
            default:
              return "Sarah Chen" // Product Manager as default
          }
        }

        const category = step.category || "Operations"
        const assignee = getSmartAssignee(category)

        return {
          id: Date.now() + index,
          title: step.title || `Action Step ${index + 1}`, // This will be the task title
          description: step.description || "", // This will be the task description
          assignee: [assignee], // Smart assignee based on category
          category: [category],
          priority:
            step.priority === "critical"
              ? "High"
              : step.priority === "high"
                ? "High"
                : step.priority === "medium"
                  ? "Medium"
                  : "Medium",
          deadline: step.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "todo",
          duration: step.duration || "1 week",
        }
      })

      console.log("Transformed steps:", transformedSteps)

      setGeneratedSteps(transformedSteps)
      setIsStepsModalOpen(true)

      console.log("Successfully generated", transformedSteps.length, "steps")
    } catch (error) {
      console.error("Error generating mission steps:", error)
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred"

      setErrorMessage(`Failed to generate steps: ${errorMsg}`)
      setTimeout(() => {
        setErrorMessage("")
      }, 5000)
    } finally {
      setIsGenerating(false)
    }
  }

  const getDefaultDeadline = (duration: string) => {
    const today = new Date()
    let daysToAdd = 14 // default 2 weeks

    if (duration.includes("1 week")) daysToAdd = 7
    else if (duration.includes("2 week")) daysToAdd = 14
    else if (duration.includes("3 week")) daysToAdd = 21
    else if (duration.includes("4 week")) daysToAdd = 28
    else if (duration.includes("1-2 week")) daysToAdd = 10
    else if (duration.includes("2-3 week")) daysToAdd = 17
    else if (duration.includes("3-4 week")) daysToAdd = 24
    else if (duration.includes("4-6 week")) daysToAdd = 35
    else if (duration.includes("4-8 week")) daysToAdd = 42
    else if (duration.includes("6-8 week")) daysToAdd = 49

    const deadline = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    return deadline.toISOString().split("T")[0]
  }

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const handleImplementSteps = () => {
    const newTasks: Task[] = generatedSteps.map((step, index) => ({
      id: (Date.now() + index).toString(),
      title: step.title, // Use the title from the transformed step
      description: step.description, // Use the description from the transformed step
      assignee: step.assignee,
      deadline: step.deadline,
      priority: step.priority,
      status: "To Do" as const,
      category: step.category,
      createdAt: new Date().toISOString(),
    }))

    setTasks([...tasks, ...newTasks])
    setIsStepsModalOpen(false)
    setGeneratedSteps([])
    setMission("")
    setTimeframe("")
    setAccomplished("")
  }

  const handleEditStep = (index: number) => {
    setEditingStepIndex(index)
    setEditingStep({ ...generatedSteps[index] })
  }

  const handleSaveStep = () => {
    if (editingStepIndex !== null && editingStep) {
      const updatedSteps = [...generatedSteps]
      updatedSteps[editingStepIndex] = editingStep
      setGeneratedSteps(updatedSteps)
      setEditingStepIndex(null)
      setEditingStep(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingStepIndex(null)
    setEditingStep(null)
  }

  const handleDeleteStep = (index: number) => {
    const updatedSteps = generatedSteps.filter((_, i) => i !== index)
    setGeneratedSteps(updatedSteps)
  }

  const updateTaskStatus = (taskId: string, newStatus: "To Do" | "In Progress" | "Done") => {
    const taskToUpdate = tasks.find((task) => task.id === taskId)

    if (!taskToUpdate) return

    if (newStatus === "Done") {
      // Move to history when marked as done
      const completedTask = {
        ...taskToUpdate,
        status: newStatus,
        deletedAt: new Date().toISOString(),
      }
      setTaskHistory((prev) => [...prev, completedTask])
      setTasks(tasks.filter((task) => task.id !== taskId))
    } else {
      // Regular status update for To Do and In Progress
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    }
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: "To Do" | "In Progress" | "Done") => {
    e.preventDefault()
    if (draggedTask) {
      updateTaskStatus(draggedTask.id, newStatus)
      setDraggedTask(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-500"
      case "In Progress":
        return "bg-blue-500"
      case "Done":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getWorkloadColor = (status: string) => {
    switch (status) {
      case "Underloaded":
        return "text-blue-400"
      case "Balanced":
        return "text-green-400"
      case "Overloaded":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getCurrentMonth = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getNextMonth = () => {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const renderTaskCard = (task: Task, onClick: (task: Task) => void) => (
    <Card
      key={task.id}
      className="border-l-4 border-l-blue-500 bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
      onClick={() => onClick(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-100">{task.title}</h3>
            <p className="text-sm text-gray-300 mt-1">{task.description}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {(Array.isArray(task.assignee) ? task.assignee : [task.assignee]).map((assignee, index) => (
                <Badge key={index} variant="outline" className="text-xs border-gray-500 text-gray-300">
                  {assignee}
                </Badge>
              ))}
              <Badge className={`text-xs text-white ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
              <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                {task.status === "Done" ? "Completed" : "Deleted"}
              </Badge>
              {(Array.isArray(task.category) ? task.category : [task.category]).map((cat, index) => (
                <Badge key={index} variant="outline" className="text-xs border-gray-500 text-gray-400">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-100">{task.deadline}</p>
            {/* Gantt chart timeline bar */}
            <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.random() * 100}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderGanttView = () => {
    if (filteredTasks.length === 0) {
      return (
        <div className="grid grid-cols-3 gap-6 min-h-[300px]">
          {/* Tasks Column */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-100">Tasks</h4>
              <p className="text-sm text-gray-400">{tasks.length} records</p>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">
                No tasks currently. Generate and implement a plan to see tasks here.
              </p>
            </div>
          </div>

          {/* Current Month Column */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="mb-4 text-center">
              <h4 className="text-lg font-semibold text-gray-100">{getCurrentMonth().split(" ")[0]}</h4>
              <p className="text-sm text-gray-400">{getCurrentMonth().split(" ")[1]}</p>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Gantt chart will appear when tasks are added</p>
            </div>
          </div>

          {/* Next Month Column */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="mb-4 text-center">
              <h4 className="text-lg font-semibold text-gray-100">{getNextMonth().split(" ")[0]}</h4>
              <p className="text-sm text-gray-400">{getNextMonth().split(" ")[1]}</p>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Gantt chart will appear when tasks are added</p>
            </div>
          </div>
        </div>
      )
    }

    return <div className="space-y-4">{filteredTasks.map((task) => renderTaskCard(task, handleTaskClick))}</div>
  }

  const renderKanbanView = () => {
    const columns = ["To Do", "In Progress", "Done"]

    return (
      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column as "To Do" | "In Progress" | "Done")}
          >
            <h3 className="font-semibold text-gray-100 mb-4">{column}</h3>
            <div className="space-y-3">
              {filteredTasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-gray-600 border-gray-500"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm text-gray-100">{task.title}</h4>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{task.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                          {task.assignee}
                        </Badge>
                        <Badge className={`text-xs text-white ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{task.deadline}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderTableView = () => (
    <div className="rounded-md border border-gray-600 bg-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-600">
            <TableHead className="text-gray-200">Task</TableHead>
            <TableHead className="text-gray-200">Assignee</TableHead>
            <TableHead className="text-gray-200">Priority</TableHead>
            <TableHead className="text-gray-200">Status</TableHead>
            <TableHead className="text-gray-200">Deadline</TableHead>
            <TableHead className="text-gray-200">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow
              key={task.id}
              className="border-gray-600 hover:bg-gray-600 cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-gray-100">{task.title}</p>
                  <p className="text-sm text-gray-300">{task.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="border-gray-500 text-gray-300">
                  {task.assignee}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`text-white ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={`text-white ${getStatusColor(task.status)}`}>{task.status}</Badge>
              </TableCell>
              <TableCell className="text-gray-200">{task.deadline}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-gray-300 border-gray-500">
                  {task.category}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1a1a1a", color: "#e0e0e0", position: "relative" }}>
      {/* Hamburger Menu - Top Left */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          background: "#2a2a2a",
          border: "1px solid #444",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000,
          color: "#e0e0e0",
          width: "50px",
          height: "50px",
          clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#3a3a3a"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2a2a2a"
        }}
      >
        ☰
      </button>

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-300px",
          width: "300px",
          height: "100vh",
          backgroundColor: "#2a2a2a",
          transition: "left 0.3s ease",
          zIndex: 999,
          padding: "20px",
          borderRight: "1px solid #444",
        }}
      >
        {/* Top section - Settings and Profile icons */}
        <div style={{ marginTop: "0px", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "20px", justifyContent: "right" }}>
            <button
              style={{
                background: "#1a1a1a",
                border: "1px solid #444",
                fontSize: "24px",
                cursor: "pointer",
                color: "#e0e0e0",
                width: "45px",
                height: "45px",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              ⚙️
            </button>
            <button
              style={{
                background: "#1a1a1a",
                border: "1px solid #444",
                fontSize: "24px",
                cursor: "pointer",
                color: "#e0e0e0",
                width: "45px",
                height: "45px",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              👤
            </button>
          </div>
        </div>

        {/* Seven vertically stacked buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Map", onClick: () => (window.location.href = "/main"), active: false },
            { label: "Command Deck", onClick: () => (window.location.href = "/command-deck"), active: true },
            { label: "Health Check", onClick: () => (window.location.href = "/health-check"), active: false },
            { label: "Forecast", onClick: () => (window.location.href = "/forecast"), active: false },
            { label: "Reports", onClick: () => (window.location.href = "/reports"), active: false },
            { label: "Network", onClick: () => (window.location.href = "/network"), active: false },
            { label: "Team", onClick: () => (window.location.href = "/team"), active: false },
          ].map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              style={{
                padding: "18px",
                fontSize: "16px",
                cursor: "pointer",
                border: "1px solid #444",
                backgroundColor: item.active ? "#007bff" : "#1a1a1a",
                color: "#e0e0e0",
                width: "100%",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                letterSpacing: "0.05em",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#3a3a3a"
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#1a1a1a"
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: "0px", paddingTop: "80px" }}>
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-gray-100">Command Deck</h1>
        </header>

        <main className="flex-1 overflow-auto p-6 space-y-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Set Your Mission Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">Set Your Mission</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-200 mb-2 block">Your Big Goal (Mission)</label>
                  <Textarea
                    placeholder="Describe your startup mission or big goal..."
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="min-h-[120px] bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400 text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-2 block">Timeline/Deadline (Optional)</label>
                    <Input
                      placeholder="e.g., 3 months, by Q2 2024, 12 weeks..."
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-2 block">
                      Already Accomplished (Optional)
                    </label>
                    <Textarea
                      placeholder="List things you've already done (one per line)..."
                      value={accomplished}
                      onChange={(e) => setAccomplished(e.target.value)}
                      className="min-h-[80px] bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <p className="text-sm text-red-300">{errorMessage}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerateMissionSteps}
                  disabled={!mission.trim() || isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Mission...
                    </>
                  ) : (
                    "Generate Startup Action Plan"
                  )}
                </Button>
              </div>
            </div>

            {/* Your Current Plan Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Your Current Plan</h2>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  {/* Plan Views Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-100">Plan Views</h3>
                    <div className="flex items-center gap-4">
                      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-gray-700 hover:bg-gray-600 border border-gray-600">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-gray-100">Add New Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-200">Title</label>
                              <Input
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Task title"
                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-200">Description</label>
                              <Textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Task description"
                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-200">Assignee</label>
                              <div className="space-y-2">
                                <Select
                                  onValueChange={(value) => {
                                    if (!newTask.assignee.includes(value)) {
                                      setNewTask({ ...newTask, assignee: [...newTask.assignee, value] })
                                    }
                                  }}
                                >
                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                                    <SelectValue placeholder="Select assignee" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-600">
                                    {teamMembers.map((member) => (
                                      <SelectItem
                                        key={member.id}
                                        value={member.name}
                                        className="text-gray-100 hover:bg-gray-700"
                                      >
                                        {member.name} - {member.role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {newTask.assignee.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {newTask.assignee.map((assignee, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs border-gray-600 text-gray-300 pr-1"
                                      >
                                        {assignee}
                                        <button
                                          onClick={() => {
                                            setNewTask({
                                              ...newTask,
                                              assignee: newTask.assignee.filter((_, i) => i !== index),
                                            })
                                          }}
                                          className="ml-1 text-gray-400 hover:text-gray-200"
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-200">Deadline</label>
                                <Input
                                  type="date"
                                  value={newTask.deadline}
                                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                  className="bg-gray-700 border-gray-600 text-gray-100"
                                  style={{ colorScheme: "dark" }}
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-200">Priority</label>
                                <Select
                                  value={newTask.priority}
                                  onValueChange={(value) =>
                                    setNewTask({ ...newTask, priority: value as "High" | "Medium" | "Low" })
                                  }
                                >
                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="High" className="text-gray-100 hover:bg-gray-700">
                                      High
                                    </SelectItem>
                                    <SelectItem value="Medium" className="text-gray-100 hover:bg-gray-700">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="Low" className="text-gray-100 hover:bg-gray-700">
                                      Low
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-200">Category</label>
                              <Select
                                onValueChange={(value) => {
                                  if (!newTask.category.includes(value)) {
                                    setNewTask({ ...newTask, category: [...newTask.category, value] })
                                  }
                                }}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  {departmentOptions.map((option) => (
                                    <SelectItem key={option} value={option} className="text-gray-100 hover:bg-gray-700">
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {newTask.category.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {newTask.category.map((category, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs border-gray-600 text-gray-300 pr-1"
                                    >
                                      {category}
                                      <button
                                        onClick={() => {
                                          setNewTask({
                                            ...newTask,
                                            category: newTask.category.filter((_, i) => i !== index),
                                          })
                                        }}
                                        className="ml-1 text-gray-400 hover:text-gray-200"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Render views based on activeView state */}
                  {activeView === "Gantt" && renderGanttView()}
                  {activeView === "Kanban" && renderKanbanView()}
                  {activeView === "Table" && renderTableView()}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
