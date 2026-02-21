import type { Ticket } from '@/types/Ticket'
import ticketsData from './store.json'

export function getTickets(): Promise<Ticket[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ticketsData as unknown as Ticket[])
    }, 2000)
  })
}

export function getTicketById(id: string): Promise<Ticket | undefined> {
  return new Promise(resolve => {
    setTimeout(() => {
      const ticket = (ticketsData as unknown as Ticket[]).find(t => t.id === id)
      resolve(ticket)
    }, 1000)
  })
}

export function updateTicketStatus(
  id: string,
  status: Ticket['status']
): Promise<Ticket | undefined> {
  return new Promise(resolve => {
    setTimeout(() => {
      const ticketIndex = (ticketsData as unknown as Ticket[]).findIndex(t => t.id === id)
      if (ticketIndex !== -1) {
        const ticket = (ticketsData as unknown as Ticket[])[ticketIndex]
        if (ticket) {
          ticket.status = status
          resolve(ticket)
        } else {
          resolve(undefined)
        }
      } else {
        resolve(undefined)
      }
    }, 1000)
  })
}
