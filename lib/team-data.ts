export interface TeamMember {
  id: string
  name: string
  role: string
  email?: string
  avatar?: string
}

export const getTeamMembers = (): TeamMember[] => {
  return [
    {
      id: "1",
      name: "Sarah Chen",
      role: "CEO & Founder",
      email: "sarah@startup.com",
    },
    {
      id: "2",
      name: "Alex Johnson",
      role: "CTO",
      email: "alex@startup.com",
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      role: "Lead Developer",
      email: "mike@startup.com",
    },
    {
      id: "4",
      name: "Emily Davis",
      role: "Product Designer",
      email: "emily@startup.com",
    },
    {
      id: "5",
      name: "James Wilson",
      role: "Marketing Manager",
      email: "james@startup.com",
    },
  ]
}

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return getTeamMembers().find((member) => member.id === id)
}

export const getTeamMemberByName = (name: string): TeamMember | undefined => {
  return getTeamMembers().find((member) => member.name === name)
}
