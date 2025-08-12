"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Target,
  Zap,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

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

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "John Doe", role: "CEO & Founder" },
  { id: "2", name: "Jane Smith", role: "CTO" },
  { id: "3", name: "Mike Johnson", role: "Lead Developer" },
  { id: "4", name: "Sarah Wilson", role: "Product Designer" },
  { id: "5", name: "Alex Chen", role: "Marketing Manager" },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Conduct User Research",
    description: "Interview 10 potential customers to understand their pain points",
    assignee: "Sarah Wilson",
    deadline: "2024-01-15",
    priority: "High",
    status: "In Progress",
    category: "Research",
  },
  {
    id: "2",
    title: "Develop MVP Features",
    description: "Build core functionality for the minimum viable product",
    assignee: "Mike Johnson",
    deadline: "2024-01-20",
    priority: "High",
    status: "In Progress",
    category: "Development",
  },
  {
    id: "3",
    title: "Create Marketing Strategy",
    description: "Develop comprehensive go-to-market strategy",
    assignee: "Alex Chen",
    deadline: "2024-01-18",
    priority: "Medium",
    status: "To Do",
    category: "Marketing",
  },
  {
    id: "4",
    title: "Design User Interface",
    description: "Create wireframes and mockups for the application",
    assignee: "Sarah Wilson",
    deadline: "2024-01-12",
    priority: "High",
    status: "Done",
    category: "Design",
  },
  {
    id: "5",
    title: "Set up Analytics",
    description: "Implement tracking and analytics for user behavior",
    assignee: "Jane Smith",
    deadline: "2024-01-25",
    priority: "Low",
    status: "To Do",
    category: "Development",
  },
]

export default function CommandDeck() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [missionInput, setMissionInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    deadline: "",
    priority: "Medium" as const,
    category: "",
  })

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesStatus = filterStatus === "all" || task.status === filterStatus

    return matchesSearch && matchesPriority && matchesStatus
  })

  const tasksByStatus = {
    "To Do": filteredTasks.filter((task) => task.status === "To Do"),
    "In Progress": filteredTasks.filter((task) => task.status === "In Progress"),
    Done: filteredTasks.filter((task) => task.status === "Done"),
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-red-500/50 text-red-400"
      case "Medium":
        return "border-yellow-500/50 text-yellow-400"
      case "Low":
        return "border-green-500/50 text-green-400"
      default:
        return "border-gray-500/50 text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const handleAddTask = () => {
    if (newTask.title && newTask.assignee) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        status: "To Do",
      }
      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        assignee: "",
        deadline: "",
        priority: "Medium",
        category: "",
      })
      setNewTaskOpen(false)
    }
  }

  const handleGenerateMissionSteps = async () => {
    if (!missionInput.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-mission-steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mission: missionInput,
          teamMembers: mockTeamMembers,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate mission steps")
      }

      const data = await response.json()

      if (data.steps && Array.isArray(data.steps)) {
        const newTasks: Task[] = data.steps.map((step: any, index: number) => ({
          id: `generated-${Date.now()}-${index}`,
          title: step.title,
          description: step.description,
          assignee: step.assignee,
          deadline: step.deadline,
          priority: step.priority,
          status: "To Do" as const,
          category: step.category,
        }))

        setTasks((prevTasks) => [...prevTasks, ...newTasks])
        setMissionInput("")
        setNewTaskOpen(false)
      }
    } catch (error) {
      console.error("Error generating mission steps:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/main">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-white">Command Deck</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-white/10 md:hidden"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-30 w-64 transition-transform duration-300 bg-black/30 backdrop-blur-sm border-r border-white/10 min-h-screen`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
          </div>

          <nav className="px-4 space-y-2">
            <Link href="/homebase">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10">
                <BarChart3 className="h-4 w-4 mr-2" />
                Homebase
              </Button>
            </Link>
            <Link href="/team">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10">
                <Users className="h-4 w-4 mr-2" />
                Team
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10 bg-white/10">
              <Zap className="h-4 w-4 mr-2" />
              Command Deck
            </Button>
            <Link href="/homebase/tasks">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10">
                <Target className="h-4 w-4 mr-2" />
                Tasks
              </Button>
            </Link>
          </nav>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Command Deck</h1>
                <p className="text-white/70">Mission control for your startup operations</p>
              </div>

              <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Create a new task manually or generate tasks from a mission statement.
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      <TabsTrigger value="ai">AI Generation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Task Title</Label>
                          <Input
                            id="title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            className="bg-slate-800 border-white/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={newTask.category}
                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            className="bg-slate-800 border-white/20"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                          className="bg-slate-800 border-white/20"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="assignee">Assignee</Label>
                          <Select
                            value={newTask.assignee}
                            onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                          >
                            <SelectTrigger className="bg-slate-800 border-white/20">
                              <SelectValue placeholder="Select assignee" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20">
                              {mockTeamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.name}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newTask.priority}
                            onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                          >
                            <SelectTrigger className="bg-slate-800 border-white/20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20">
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="deadline">Deadline</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={newTask.deadline}
                            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                            className="bg-slate-800 border-white/20"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setNewTaskOpen(false)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddTask} className="bg-purple-600 hover:bg-purple-700">
                          Add Task
                        </Button>
                      </DialogFooter>
                    </TabsContent>

                    <TabsContent value="ai" className="space-y-4">
                      <div>
                        <Label htmlFor="mission">Mission Statement</Label>
                        <Textarea
                          id="mission"
                          placeholder="Describe your startup mission or goal, and AI will generate actionable tasks..."
                          value={missionInput}
                          onChange={(e) => setMissionInput(e.target.value)}
                          className="bg-slate-800 border-white/20 min-h-[100px]"
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setNewTaskOpen(false)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleGenerateMissionSteps}
                          disabled={!missionInput.trim() || isGenerating}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Generate Tasks
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Total Tasks</p>
                      <p className="text-2xl font-bold text-white">{tasks.length}</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">In Progress</p>
                      <p className="text-2xl font-bold text-white">{tasksByStatus["In Progress"].length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Completed</p>
                      <p className="text-2xl font-bold text-white">{tasksByStatus["Done"].length}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">High Priority</p>
                      <p className="text-2xl font-bold text-white">
                        {tasks.filter((t) => t.priority === "High").length}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/40 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-[180px] bg-black/40 border-white/20 text-white">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px] bg-black/40 border-white/20 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      {getStatusIcon(status)}
                      {status}
                    </h3>
                    <Badge variant="secondary" className="bg-white/10 text-white">
                      {statusTasks.length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {statusTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="bg-black/40 border-white/20 backdrop-blur-sm hover:bg-black/50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm">{task.title}</h4>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-white/50 hover:text-white"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-slate-900 border-white/20">
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "To Do")}>
                                  Move to To Do
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "In Progress")}>
                                  Move to In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "Done")}>
                                  Move to Done
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <p className="text-xs text-white/70 mb-3 line-clamp-2">{task.description}</p>

                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-white/10 text-white/70">
                              {task.category}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-white/70">
                              <User className="h-3 w-3" />
                              {task.assignee}
                            </div>
                            <div className="flex items-center gap-1 text-white/70">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.deadline).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
