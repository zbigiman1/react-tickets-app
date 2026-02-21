import { getTicketById as apiGetTickedById, getTickets as apiGetTickets, updateTicketStatus as apiUpdateTicketStatus } from '@/api'
import type { Status, Ticket } from '@/types'
import { create } from 'zustand'

interface TicketsState {
    tickets: Ticket[]
    currentTicket: Ticket | null
    loading: boolean
    error: string | null
    getTickets: () => Promise<void>
    getTicketById: (id: string) => Promise<void>
    updateTicketStatus: (id: string, status: Status) => Promise<void>
    filterTicketsByStatus: (status: Status) => Ticket[]
}

export const useTicketsStore = create<TicketsState>((set, get) => ({
    tickets: [],
    loading: false,
    currentTicket: null,
    error: null,
    getTickets: async () => {
        set({ loading: true, error: null })
        try {
            const tickets = await apiGetTickets()
            set({ tickets, error: null })
        } catch (error) {
            const message = (error as Error)?.message ?? String(error)
            console.error('Failed to fetch tickets:', error)
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },
    getTicketById: async (id: string) => {
        const existing = get().currentTicket
        if (existing?.id === id) {
            return
        }
        set({ loading: true, error: null })
        try {
            const ticket = await apiGetTickedById(id)
            if (!ticket) {
                const message = `Ticket with id ${id} not found test`
                console.error(message)
                set({ currentTicket: null, error: message })
                return
            }
            set({ currentTicket: ticket, error: null })
        } catch (error) {
            const message = (error as Error)?.message ?? String(error)
            console.error('Failed to fetch ticket:', error)
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },
    updateTicketStatus: async (id: string, status: Status) => {
        set({ loading: true, error: null })
        try {
            await apiUpdateTicketStatus(id, status)
            set((state) => ({
                tickets: state.tickets.map((ticket) =>
                    ticket.id === id ? { ...ticket, status } : ticket
                ),
                error: null,
            }))
            set((state) => ({
                currentTicket: state.currentTicket?.id === id
                    ? { ...state.currentTicket, status } as Ticket
                    : state.currentTicket,
            }))
        } catch (error) {
            const message = (error as Error)?.message ?? String(error)
            console.error('Failed to update ticket status:', error)
            set({ error: message })
        } finally {
            set({ loading: false })
        }
    },
    filterTicketsByStatus: (status: Status) => {
        return get().tickets.filter(ticket => ticket.status === status)
    }
}))
