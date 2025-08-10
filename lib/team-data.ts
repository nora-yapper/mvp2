export interface TeamMember {
  id: string
  name: string
  role: string
  skills: string[]
  email?: string
  avatar?: string
}

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Founder & CEO",
    skills: ["Strategy", "Fundraising", "Business Development", "Product Vision", "Leadership"],
    email: "alex@startup.com",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Sarah Kim",
    role: "Co-founder & CTO",
    skills: ["Full-stack Development", "System Architecture", "Technical Leadership", "DevOps", "AI/ML"],
    email: "sarah@startup.com",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    role: "Lead Designer",
    skills: ["UI/UX Design", "Product Design", "Branding", "User Research", "Prototyping"],
    email: "marcus@startup.com",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    role: "Marketing Lead",
    skills: ["Digital Marketing", "Content Creation", "Social Media", "Analytics", "Growth Hacking"],
    email: "emily@startup.com",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "5",
    name: "David Park",
    role: "Backend Developer",
    skills: ["Backend Development", "Database Design", "API Development", "Cloud Infrastructure", "Security"],
    email: "david@startup.com",
    avatar: "/placeholder-user.jpg",
  },
]

export function getTeamMembers(): TeamMember[] {
  // In a real app, this would fetch from a database or API
  return defaultTeamMembers
}

export function getTeamMemberById(id: string): TeamMember | undefined {
  return defaultTeamMembers.find((member) => member.id === id)
}

export function getTeamMembersBySkill(skill: string): TeamMember[] {
  return defaultTeamMembers.filter((member) => member.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())))
}
