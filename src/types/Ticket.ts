export type Status = "new" | "in_progress" | "closed"
export type Priority = "low" | "medium" | "high"

export type Ticket = {
  id: string
  customerName: string
  subject: string
  description: string
  priority: Priority
  status: Status
  createdAt: string
}
