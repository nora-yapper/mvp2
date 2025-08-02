"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, DollarSign, CheckCircle, Plus, Edit, Trash2, Download } from "lucide-react"
import Link from "next/link"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  category: string
}

export default function SalesTaskPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Create sales pitch deck",
      description: "Develop a compelling 10-slide pitch deck for potential customers",
      status: "in-progress",
      priority: "high",
      dueDate: "2024-02-15",
      category: "Content Creation",
    },
    {
      id: "2",
      title: "Identify 50 potential leads",
      description: "Research and compile a list of qualified prospects in target market",
      status: "completed",
      priority: "high",
      dueDate: "2024-02-10",
      category: "Lead Generation",
    },
    {
      id: "3",
      title: "Set up CRM system",
      description: "Configure customer relationship management system for tracking leads",
      status: "pending",
      priority: "medium",
      dueDate: "2024-02-20",
      category: "Tools & Systems",
    },
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: "",
    category: "General",
  })

  const [showAddTask, setShowAddTask] = useState(false)

  const addTask = () => {
    if (newTask.title && newTask.description) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: "pending",
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        category: newTask.category,
      }
      setTasks([...tasks, task])
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "", category: "General" })
      setShowAddTask(false)
    }
  }

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      default:
        return "bg-slate-400"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/sales/plan"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Sales Plan</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sales Tasks</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Execute your sales strategy step by step</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                {completedTasks}/{totalTasks} Complete
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Overview */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sales Progress Overview</span>
              <Button onClick={() => setShowAddTask(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {tasks.filter((t) => t.status === "pending").length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {tasks.filter((t) => t.status === "in-progress").length}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Task Modal */}
        {showAddTask && (
          <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    placeholder="Task category"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe the task"
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
                <Button onClick={addTask}>Add Task</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-6">
          {tasks.map((task) => (
            <Card key={task.id} className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteTask(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{task.category}</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={task.status === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, "pending")}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={task.status === "in-progress" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, "in-progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={task.status === "completed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, "completed")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No tasks yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Start by adding your first sales task to begin executing your strategy.
              </p>
              <Button onClick={() => setShowAddTask(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
