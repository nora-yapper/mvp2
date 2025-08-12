import { v4 as uuidv4 } from "uuid"

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar: string
  status: "active" | "inactive" | "away"
  skills: string[]
  joinDate: string
  projects: string[]
  performance: {
    tasksCompleted: number
    tasksInProgress: number
    efficiency: number
  }
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate: string
  progress: number
  teamMembers: string[]
  budget: number
  spent: number
}

export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  project: string
  status: "todo" | "in-progress" | "review" | "completed"
  priority: "low" | "medium" | "high" | "critical"
  dueDate: string
  createdDate: string
  estimatedHours: number
  actualHours: number
  tags: string[]
}

// Mock data
export const mockTeamMembers: TeamMember[] = [
  {
    id: uuidv4(),
    name: "Sarah Johnson",
    role: "Product Manager",
    email: "sarah@company.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    skills: ["Product Strategy", "User Research", "Agile", "Analytics"],
    joinDate: "2023-01-15",
    projects: ["proj-1", "proj-2"],
    performance: {
      tasksCompleted: 45,
      tasksInProgress: 3,
      efficiency: 92,
    },
  },
  {
    id: uuidv4(),
    name: "Mike Chen",
    role: "Senior Developer",
    email: "mike@company.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    joinDate: "2022-11-20",
    projects: ["proj-1", "proj-3"],
    performance: {
      tasksCompleted: 67,
      tasksInProgress: 5,
      efficiency: 88,
    },
  },
  {
    id: uuidv4(),
    name: "Emily Rodriguez",
    role: "UX Designer",
    email: "emily@company.com",
    avatar: "/placeholder-user.jpg",
    status: "away",
    skills: ["UI/UX Design", "Figma", "User Testing", "Prototyping"],
    joinDate: "2023-03-10",
    projects: ["proj-2", "proj-4"],
    performance: {
      tasksCompleted: 32,
      tasksInProgress: 2,
      efficiency: 95,
    },
  },
  {
    id: uuidv4(),
    name: "David Kim",
    role: "DevOps Engineer",
    email: "david@company.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    skills: ["Docker", "Kubernetes", "CI/CD", "Monitoring"],
    joinDate: "2022-08-05",
    projects: ["proj-1", "proj-3", "proj-4"],
    performance: {
      tasksCompleted: 54,
      tasksInProgress: 4,
      efficiency: 90,
    },
  },
]

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Mobile App Redesign",
    description: "Complete redesign of the mobile application with improved UX",
    status: "in-progress",
    priority: "high",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    progress: 65,
    teamMembers: ["sarah-id", "mike-id", "david-id"],
    budget: 150000,
    spent: 97500,
  },
  {
    id: "proj-2",
    name: "Customer Portal",
    description: "New customer self-service portal development",
    status: "planning",
    priority: "medium",
    startDate: "2024-02-15",
    endDate: "2024-06-30",
    progress: 15,
    teamMembers: ["sarah-id", "emily-id"],
    budget: 200000,
    spent: 30000,
  },
  {
    id: "proj-3",
    name: "Infrastructure Upgrade",
    description: "Migrate to cloud infrastructure and improve scalability",
    status: "in-progress",
    priority: "critical",
    startDate: "2023-12-01",
    endDate: "2024-04-15",
    progress: 80,
    teamMembers: ["mike-id", "david-id"],
    budget: 100000,
    spent: 80000,
  },
  {
    id: "proj-4",
    name: "Analytics Dashboard",
    description: "Business intelligence dashboard for stakeholders",
    status: "completed",
    priority: "medium",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    progress: 100,
    teamMembers: ["emily-id", "david-id"],
    budget: 75000,
    spent: 72000,
  },
]

export const mockTasks: Task[] = [
  {
    id: uuidv4(),
    title: "Design new login flow",
    description: "Create wireframes and mockups for the new authentication flow",
    assignee: "emily-id",
    project: "proj-1",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-02-15",
    createdDate: "2024-01-20",
    estimatedHours: 16,
    actualHours: 12,
    tags: ["design", "ux", "authentication"],
  },
  {
    id: uuidv4(),
    title: "Implement OAuth integration",
    description: "Add OAuth 2.0 support for third-party authentication",
    assignee: "mike-id",
    project: "proj-1",
    status: "todo",
    priority: "medium",
    dueDate: "2024-02-28",
    createdDate: "2024-01-25",
    estimatedHours: 24,
    actualHours: 0,
    tags: ["backend", "authentication", "oauth"],
  },
  {
    id: uuidv4(),
    title: "Set up monitoring alerts",
    description: "Configure monitoring and alerting for the new infrastructure",
    assignee: "david-id",
    project: "proj-3",
    status: "completed",
    priority: "critical",
    dueDate: "2024-01-31",
    createdDate: "2024-01-10",
    estimatedHours: 8,
    actualHours: 10,
    tags: ["devops", "monitoring", "infrastructure"],
  },
]

// Utility functions
export function getTeamMemberById(id: string): TeamMember | undefined {
  return mockTeamMembers.find((member) => member.id === id)
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((project) => project.id === id)
}

export function getTaskById(id: string): Task | undefined {
  return mockTasks.find((task) => task.id === id)
}

export function getTasksByProject(projectId: string): Task[] {
  return mockTasks.filter((task) => task.project === projectId)
}

export function getTasksByAssignee(assigneeId: string): Task[] {
  return mockTasks.filter((task) => task.assignee === assigneeId)
}

export function getProjectsByTeamMember(memberId: string): Project[] {
  return mockProjects.filter((project) => project.teamMembers.includes(memberId))
}

export function calculateTeamEfficiency(): number {
  const totalEfficiency = mockTeamMembers.reduce((sum, member) => sum + member.performance.efficiency, 0)
  return Math.round(totalEfficiency / mockTeamMembers.length)
}

export function getActiveProjects(): Project[] {
  return mockProjects.filter((project) => project.status === "in-progress")
}

export function getOverdueTasks(): Task[] {
  const today = new Date()
  return mockTasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    return dueDate < today && task.status !== "completed"
  })
}
