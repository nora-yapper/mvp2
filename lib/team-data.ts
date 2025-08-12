export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  skills: string[]
  avatar: string
  status: "active" | "busy" | "away"
  workload: number // percentage
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    email: "sarah@startup.com",
    skills: ["Strategy", "Fundraising", "Product Vision", "Leadership"],
    avatar: "/placeholder-user.jpg",
    status: "active",
    workload: 85,
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    role: "CTO & Co-founder",
    email: "alex@startup.com",
    skills: ["Full-stack Development", "System Architecture", "DevOps", "AI/ML"],
    avatar: "/placeholder-user.jpg",
    status: "busy",
    workload: 90,
  },
  {
    id: "3",
    name: "Maya Patel",
    role: "Head of Product",
    email: "maya@startup.com",
    skills: ["Product Management", "UX Design", "User Research", "Analytics"],
    avatar: "/placeholder-user.jpg",
    status: "active",
    workload: 75,
  },
  {
    id: "4",
    name: "Jordan Kim",
    role: "Lead Developer",
    email: "jordan@startup.com",
    skills: ["React", "Node.js", "Database Design", "API Development"],
    avatar: "/placeholder-user.jpg",
    status: "active",
    workload: 80,
  },
  {
    id: "5",
    name: "Emily Watson",
    role: "Marketing Manager",
    email: "emily@startup.com",
    skills: ["Digital Marketing", "Content Strategy", "SEO", "Social Media"],
    avatar: "/placeholder-user.jpg",
    status: "away",
    workload: 60,
  },
]

export function getTeamMember(id: string): TeamMember | undefined {
  return teamMembers.find((member) => member.id === id)
}

export function getAvailableTeamMembers(): TeamMember[] {
  return teamMembers.filter((member) => member.workload < 95)
}

export function getTeamMembersBySkill(skill: string): TeamMember[] {
  return teamMembers.filter((member) => member.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())))
}
