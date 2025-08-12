import { v4 as uuidv4 } from "uuid"

export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  skills: string[]
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "CEO & Co-founder",
    email: "alex@startup.com",
    skills: ["Leadership", "Strategy", "Business Development", "Fundraising", "Product Vision"],
  },
  {
    id: "2",
    name: "Sarah Kim",
    role: "CTO & Co-founder",
    email: "sarah@startup.com",
    skills: ["Development", "Architecture", "DevOps", "Technical Leadership", "AI/ML"],
  },
  {
    id: "3",
    name: "Marcus Johnson",
    role: "Head of Design",
    email: "marcus@startup.com",
    skills: ["UI/UX Design", "Design", "Prototyping", "User Research", "Branding"],
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    role: "Head of Marketing",
    email: "emily@startup.com",
    skills: ["Marketing", "Content Creation", "Social Media", "SEO", "Analytics"],
  },
  {
    id: "5",
    name: "David Park",
    role: "Senior Developer",
    email: "david@startup.com",
    skills: ["Development", "Frontend", "Backend", "Database", "Testing"],
  },
]

export function getTeamMembers(): TeamMember[] {
  if (typeof window === "undefined") {
    return defaultTeamMembers
  }

  const stored = localStorage.getItem("teamMembers")
  if (stored) {
    return JSON.parse(stored)
  }

  // Initialize with default data
  localStorage.setItem("teamMembers", JSON.stringify(defaultTeamMembers))
  return defaultTeamMembers
}

export function saveTeamMembers(members: TeamMember[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("teamMembers", JSON.stringify(members))
  }
}

export function addTeamMember(member: Omit<TeamMember, "id">): TeamMember {
  const newMember: TeamMember = {
    ...member,
    id: uuidv4(),
  }

  const currentMembers = getTeamMembers()
  const updatedMembers = [...currentMembers, newMember]
  saveTeamMembers(updatedMembers)

  return newMember
}

export function updateTeamMember(id: string, updates: Partial<TeamMember>): void {
  const currentMembers = getTeamMembers()
  const updatedMembers = currentMembers.map((member) => (member.id === id ? { ...member, ...updates } : member))
  saveTeamMembers(updatedMembers)
}

export function removeTeamMember(id: string): void {
  const currentMembers = getTeamMembers()
  const updatedMembers = currentMembers.filter((member) => member.id !== id)
  saveTeamMembers(updatedMembers)
}
