"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Clock, Calendar, Kanban, TableIcon, Loader2, Edit, Save, X } from "lucide-react"
import Sidebar from "./Sidebar"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  deadline: string
  priority: "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Done"
  category: string
}

interface GeneratedStep {
  title: string
  description: string
  assignee: string
  deadline: string
  priority: "High" | "Medium" | "Low"
  category: string
}

interface TeamMemberWorkload {
  name: string
  workload: number
  status: "Underloaded" | "Balanced" | "Overloaded"
}

interface TeamMember {
  id: string
  name: string
  role: string
}

export default function CommandDeck() {
  const [activeView, setActiveView] = useState("Timeline")
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [mission, setMission] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSteps, setGeneratedSteps] = useState<GeneratedStep[]>([])
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false)
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null)
  const [editingStep, setEditingStep] = useState<GeneratedStep | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    deadline: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    category: "General",
  })

  // Mock team members data
  const teamMembers: TeamMember[] = [
    { id: "1", name: "Sarah Chen", role: "Product Manager" },
    { id: "2", name: "Alex Johnson", role: "Developer" },
    { id: "3", name: "Mike Rodriguez", role: "Designer" },
    { id: "4", name: "Emily Davis", role: "Marketing" },
    { id: "5", name: "James Wilson", role: "Sales" },
  ]

  // Mock team workload data
  const teamWorkload: TeamMemberWorkload[] = [
    { name: "Sarah Chen", workload: 45, status: "Underloaded" },
    { name: "Alex Johnson", workload: 75, status: "Balanced" },
    { name: "Mike Rodriguez", workload: 92, status: "Overloaded" },
    { name: "Emily Davis", workload: 68, status: "Balanced" },
    { name: "James Wilson", workload: 34, status: "Underloaded" },
  ]

  const sidebarItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "DashboardIcon",
      items: [],
    },
    {
      title: "Health Check",
      url: "/health-check",
      icon: "Activity",
      items: [],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: "SettingsIcon",
      items: [],
    },
  ]

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
      }
      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        deadline: "",
        priority: "Medium",
        category: "General",
      })
      setIsAddTaskOpen(false)
    }
  }

  const handleGenerateMissionSteps = async () => {
    if (!mission.trim()) return

    setIsGenerating(true)
    try {
      // Mock API call - replace with actual API when available
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockSteps: GeneratedStep[] = [
        {
          title: "Market Research",
          description: "Conduct comprehensive market analysis",
          assignee: "Sarah Chen",
          deadline: "2024-02-15",
          priority: "High",
          category: "Research",
        },
        {
          title: "Product Development",
          description: "Build MVP based on research findings",
          assignee: "Alex Johnson",
          deadline: "2024-03-01",
          priority: "High",
          category: "Development",
        },
      ]

      setGeneratedSteps(mockSteps)
      setIsStepsModalOpen(true)
    } catch (error) {
      console.error("Error generating mission steps:", error)
      alert("Failed to generate mission steps. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImplementSteps = () => {
    const newTasks: Task[] = generatedSteps.map((step, index) => ({
      id: (Date.now() + index).toString(),
      title: step.title,
      description: step.description,
      assignee: step.assignee,
      deadline: step.deadline,
      priority: step.priority,
      status: "To Do" as const,
      category: step.category,
    }))

    setTasks([...tasks, ...newTasks])
    setIsStepsModalOpen(false)
    setGeneratedSteps([])
    setMission("")
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
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
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

  const renderTimelineView = () => {
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
              <p className="text-gray-400 text-sm">Timeline will appear when tasks are added</p>
            </div>
          </div>

          {/* Next Month Column */}
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="mb-4 text-center">
              <h4 className="text-lg font-semibold text-gray-100">{getNextMonth().split(" ")[0]}</h4>
              <p className="text-sm text-gray-400">{getNextMonth().split(" ")[1]}</p>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Timeline will appear when tasks are added</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="border-l-4 border-l-blue-500 bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-100">{task.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{task.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {task.assignee}
                    </Badge>
                    <Badge className={`text-xs text-white ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                    <Badge className={`text-xs text-white ${getStatusColor(task.status)}`}>{task.status}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-100">{task.deadline}</p>
                  <p className="text-xs text-gray-400">{task.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderKanbanView = () => {
    const columns = ["To Do", "In Progress", "Done"]

    return (
      <div className="grid grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h3 className="font-semibold text-gray-100 mb-4">{column}</h3>
            <div className="space-y-3">
              {filteredTasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow bg-gray-600 border-gray-500"
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm text-gray-100">{task.title}</h4>
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
            <TableRow key={task.id} className="border-gray-600 hover:bg-gray-600">
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
                <Select
                  value={task.status}
                  onValueChange={(value) => updateTaskStatus(task.id, value as "To Do" | "In Progress" | "Done")}
                >
                  <SelectTrigger className="w-32 bg-gray-600 border-gray-500 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="To Do" className="text-gray-100 hover:bg-gray-600">
                      To Do
                    </SelectItem>
                    <SelectItem value="In Progress" className="text-gray-100 hover:bg-gray-600">
                      In Progress
                    </SelectItem>
                    <SelectItem value="Done" className="text-gray-100 hover:bg-gray-600">
                      Done
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-gray-200">{task.deadline}</TableCell>
              <TableCell className="text-gray-200">{task.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-gray-100">Command Deck</h1>
          <Button variant="outline" className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-transparent">
            Recalibrate
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6 space-y-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Set Your Mission Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">Set Your Mission</h2>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your big goal..."
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="min-h-[120px] bg-gray-800 border-gray-600 text-gray-100 placeholder:text-gray-400 text-lg"
                />
                <Button
                  onClick={handleGenerateMissionSteps}
                  disabled={!mission.trim() || isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    "Generate Plan"
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
                              <Select
                                value={newTask.assignee}
                                onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
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
                            </div>
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
                            <div>
                              <label className="text-sm font-medium text-gray-200">Category</label>
                              <Input
                                value={newTask.category}
                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                placeholder="Task category"
                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                              />
                            </div>
                            <Button onClick={handleAddTask} className="w-full bg-blue-600 hover:bg-blue-700">
                              Add Task
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-200 hover:bg-gray-700 bg-transparent"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Task History
                      </Button>

                      <div className="flex items-center gap-2">
                        {[
                          { name: "Timeline", icon: Calendar },
                          { name: "Kanban", icon: Kanban },
                          { name: "Table", icon: TableIcon },
                        ].map((view) => (
                          <Button
                            key={view.name}
                            variant={activeView === view.name ? "default" : "ghost"}
                            onClick={() => setActiveView(view.name)}
                            className={
                              activeView === view.name
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                            }
                          >
                            <view.icon className="mr-2 h-4 w-4" />
                            {view.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-4 mb-6">
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
                    />
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-100">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all" className="text-gray-100 hover:bg-gray-700">
                          All Priority
                        </SelectItem>
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
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-100">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="all" className="text-gray-100 hover:bg-gray-700">
                          All Status
                        </SelectItem>
                        <SelectItem value="To Do" className="text-gray-100 hover:bg-gray-700">
                          To Do
                        </SelectItem>
                        <SelectItem value="In Progress" className="text-gray-100 hover:bg-gray-700">
                          In Progress
                        </SelectItem>
                        <SelectItem value="Done" className="text-gray-100 hover:bg-gray-700">
                          Done
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Content */}
                  {activeView === "Timeline" && renderTimelineView()}
                  {activeView === "Kanban" && renderKanbanView()}
                  {activeView === "Table" && renderTableView()}
                </CardContent>
              </Card>
            </div>

            {/* Team Workload Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Team Workload</h2>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {teamWorkload.map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-medium text-gray-100">{member.name}</h4>
                            <div className="flex items-center gap-4">
                              <span className={`text-sm font-medium ${getWorkloadColor(member.status)}`}>
                                {member.status}
                              </span>
                              <span className="text-sm text-gray-300">{member.workload}%</span>
                            </div>
                          </div>
                          <Progress value={member.workload} className="h-2 bg-gray-700" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Generated Steps Modal */}
      <Dialog open={isStepsModalOpen} onOpenChange={setIsStepsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Generated Action Plan</DialogTitle>
            <p className="text-sm text-gray-300">Mission: {mission}</p>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Here are the actionable steps to achieve your mission. You can edit, delete, or modify these steps before
              implementing them:
            </p>
            <div className="space-y-3">
              {generatedSteps.map((step, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500 bg-gray-700 border-gray-600">
                  <CardContent className="p-4">
                    {editingStepIndex === index ? (
                      // Edit mode
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-200">Title</label>
                          <Input
                            value={editingStep?.title || ""}
                            onChange={(e) =>
                              setEditingStep((prev) => (prev ? { ...prev, title: e.target.value } : null))
                            }
                            className="bg-gray-600 border-gray-500 text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-200">Description</label>
                          <Textarea
                            value={editingStep?.description || ""}
                            onChange={(e) =>
                              setEditingStep((prev) => (prev ? { ...prev, description: e.target.value } : null))
                            }
                            className="bg-gray-600 border-gray-500 text-gray-100"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-200">Assignee</label>
                            <Select
                              value={editingStep?.assignee || ""}
                              onValueChange={(value) =>
                                setEditingStep((prev) => (prev ? { ...prev, assignee: value } : null))
                              }
                            >
                              <SelectTrigger className="bg-gray-600 border-gray-500 text-gray-100">
                                <SelectValue />
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
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-200">Priority</label>
                            <Select
                              value={editingStep?.priority || "Medium"}
                              onValueChange={(value) =>
                                setEditingStep((prev) =>
                                  prev ? { ...prev, priority: value as "High" | "Medium" | "Low" } : null,
                                )
                              }
                            >
                              <SelectTrigger className="bg-gray-600 border-gray-500 text-gray-100">
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-200">Deadline</label>
                            <Input
                              type="date"
                              value={editingStep?.deadline || ""}
                              onChange={(e) =>
                                setEditingStep((prev) => (prev ? { ...prev, deadline: e.target.value } : null))
                              }
                              className="bg-gray-600 border-gray-500 text-gray-100"
                              style={{ colorScheme: "dark" }}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-200">Category</label>
                            <Input
                              value={editingStep?.category || ""}
                              onChange={(e) =>
                                setEditingStep((prev) => (prev ? { ...prev, category: e.target.value } : null))
                              }
                              className="bg-gray-600 border-gray-500 text-gray-100"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="border-gray-500 text-gray-200 hover:bg-gray-600 bg-transparent"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveStep} className="bg-green-600 hover:bg-green-700">
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-100">{step.title}</h3>
                          <p className="text-sm text-gray-300 mt-1">{step.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                              {step.assignee}
                            </Badge>
                            <Badge className={`text-xs text-white ${getPriorityColor(step.priority)}`}>
                              {step.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                              {step.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-100">{step.deadline}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStep(index)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-100 hover:bg-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStep(index)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsStepsModalOpen(false)}
                className="border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                Dismiss
              </Button>
              <Button
                onClick={handleImplementSteps}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={generatedSteps.length === 0}
              >
                Implement All Steps ({generatedSteps.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
