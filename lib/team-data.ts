import { v4 as uuidv4 } from "uuid"

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar: string
  status: "active" | "away" | "busy" | "offline"
  department: string
  joinDate: string
  skills: string[]
  performance: {
    score: number
    trend: "up" | "down" | "stable"
    lastReview: string
  }
}

export interface Project {
  id: string
  name: string
  status: "active" | "completed" | "on-hold" | "cancelled"
  progress: number
  teamMembers: string[]
  deadline: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface HealthMetric {
  id: string
  name: string
  value: number
  unit: string
  status: "healthy" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  lastUpdated: string
}

export interface ForecastData {
  id: string
  metric: string
  currentValue: number
  projectedValue: number
  confidence: number
  timeframe: string
  factors: string[]
}

export interface Report {
  id: string
  title: string
  type: "financial" | "performance" | "analytics" | "compliance"
  status: "draft" | "review" | "approved" | "published"
  createdBy: string
  createdDate: string
  lastModified: string
  size: string
}

export interface NetworkContact {
  id: string
  name: string
  company: string
  position: string
  email: string
  phone?: string
  category: "investor" | "mentor" | "partner" | "customer" | "vendor" | "advisor"
  relationship: "strong" | "medium" | "weak"
  lastContact: string
  notes: string
}

// Mock data with UUID
export const mockTeamMembers: TeamMember[] = [
  {
    id: uuidv4(),
    name: "Sarah Chen",
    role: "Product Manager",
    email: "sarah.chen@company.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    department: "Product",
    joinDate: "2023-01-15",
    skills: ["Product Strategy", "User Research", "Agile", "Analytics"],
    performance: {
      score: 92,
      trend: "up",
      lastReview: "2024-01-15",
    },
  },
  {
    id: uuidv4(),
    name: "Marcus Johnson",
    role: "Senior Developer",
    email: "marcus.johnson@company.com",
    avatar: "/placeholder-user.jpg",
    status: "active",
    department: "Engineering",
    joinDate: "2022-08-20",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    performance: {
      score: 88,
      trend: "stable",
      lastReview: "2024-01-10",
    },
  },
  {
    id: uuidv4(),
    name: "Emily Rodriguez",
    role: "UX Designer",
    email: "emily.rodriguez@company.com",
    avatar: "/placeholder-user.jpg",
    status: "away",
    department: "Design",
    joinDate: "2023-03-10",
    skills: ["UI/UX Design", "Figma", "User Testing", "Prototyping"],
    performance: {
      score: 95,
      trend: "up",
      lastReview: "2024-01-20",
    },
  },
]

export const mockProjects: Project[] = [
  {
    id: uuidv4(),
    name: "Mobile App Redesign",
    status: "active",
    progress: 75,
    teamMembers: [mockTeamMembers[0].id, mockTeamMembers[2].id],
    deadline: "2024-03-15",
    priority: "high",
  },
  {
    id: uuidv4(),
    name: "API Integration",
    status: "active",
    progress: 45,
    teamMembers: [mockTeamMembers[1].id],
    deadline: "2024-02-28",
    priority: "medium",
  },
]

export const mockHealthMetrics: HealthMetric[] = [
  {
    id: uuidv4(),
    name: "System Uptime",
    value: 99.9,
    unit: "%",
    status: "healthy",
    trend: "stable",
    lastUpdated: "2024-01-25T10:30:00Z",
  },
  {
    id: uuidv4(),
    name: "Response Time",
    value: 245,
    unit: "ms",
    status: "healthy",
    trend: "down",
    lastUpdated: "2024-01-25T10:30:00Z",
  },
  {
    id: uuidv4(),
    name: "Error Rate",
    value: 0.02,
    unit: "%",
    status: "healthy",
    trend: "stable",
    lastUpdated: "2024-01-25T10:30:00Z",
  },
  {
    id: uuidv4(),
    name: "CPU Usage",
    value: 78,
    unit: "%",
    status: "warning",
    trend: "up",
    lastUpdated: "2024-01-25T10:30:00Z",
  },
]

export const mockForecastData: ForecastData[] = [
  {
    id: uuidv4(),
    metric: "Monthly Revenue",
    currentValue: 125000,
    projectedValue: 145000,
    confidence: 85,
    timeframe: "Next Quarter",
    factors: ["Seasonal trends", "New product launch", "Market expansion"],
  },
  {
    id: uuidv4(),
    metric: "User Growth",
    currentValue: 15000,
    projectedValue: 22000,
    confidence: 78,
    timeframe: "Next 6 months",
    factors: ["Marketing campaigns", "Product improvements", "Referral program"],
  },
]

export const mockReports: Report[] = [
  {
    id: uuidv4(),
    title: "Q4 2023 Financial Report",
    type: "financial",
    status: "published",
    createdBy: "Sarah Chen",
    createdDate: "2024-01-15",
    lastModified: "2024-01-20",
    size: "2.4 MB",
  },
  {
    id: uuidv4(),
    title: "Team Performance Analysis",
    type: "performance",
    status: "review",
    createdBy: "Marcus Johnson",
    createdDate: "2024-01-22",
    lastModified: "2024-01-24",
    size: "1.8 MB",
  },
]

export const mockNetworkContacts: NetworkContact[] = [
  {
    id: uuidv4(),
    name: "David Kim",
    company: "TechVentures Capital",
    position: "Partner",
    email: "david.kim@techventures.com",
    phone: "+1-555-0123",
    category: "investor",
    relationship: "strong",
    lastContact: "2024-01-20",
    notes: "Interested in Series A funding. Follow up on term sheet.",
  },
  {
    id: uuidv4(),
    name: "Lisa Wang",
    company: "StartupMentor Inc",
    position: "Senior Advisor",
    email: "lisa.wang@startupmentor.com",
    category: "mentor",
    relationship: "strong",
    lastContact: "2024-01-18",
    notes: "Provides excellent product strategy guidance. Monthly check-ins scheduled.",
  },
]

// Utility functions
export function getTeamMemberById(id: string): TeamMember | undefined {
  return mockTeamMembers.find((member) => member.id === id)
}

export function getProjectsByTeamMember(memberId: string): Project[] {
  return mockProjects.filter((project) => project.teamMembers.includes(memberId))
}

export function getHealthMetricsByStatus(status: HealthMetric["status"]): HealthMetric[] {
  return mockHealthMetrics.filter((metric) => metric.status === status)
}

export function getReportsByType(type: Report["type"]): Report[] {
  return mockReports.filter((report) => report.type === type)
}

export function getContactsByCategory(category: NetworkContact["category"]): NetworkContact[] {
  return mockNetworkContacts.filter((contact) => contact.category === category)
}
