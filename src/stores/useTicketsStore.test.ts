import type { Ticket } from '@/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Create mocked API functions inside the factory so vitest hoisting is safe
vi.mock('@/api', () => ({
  getTickets: vi.fn(),
  getTicketById: vi.fn(),
  updateTicketStatus: vi.fn()
}))

import * as api from '@/api'
import { useTicketsStore } from './useTicketsStore'

describe('useTicketsStore', () => {
  const initialState = {
    tickets: [] as Ticket[],
    currentTicket: null as Ticket | null,
    loading: false,
    error: null as string | null
  }

  beforeEach(() => {
    // reset API mocks
    vi.mocked(api.getTickets).mockReset()
    vi.mocked(api.getTicketById).mockReset()
    vi.mocked(api.updateTicketStatus).mockReset()

    // reset store state
    useTicketsStore.setState({
      tickets: [...initialState.tickets],
      currentTicket: initialState.currentTicket,
      loading: initialState.loading,
      error: initialState.error
    })

    // suppress console.error output from the store during tests (we assert state instead)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches tickets successfully with getTickets', async () => {
    const fakeTickets: Ticket[] = [
      {
        id: '1',
        subject: 'A',
        customerName: 'Alice',
        description: 'd',
        priority: 'low',
        status: 'new',
        createdAt: '2020-01-01'
      } as Ticket
    ]
    vi.mocked(api.getTickets).mockResolvedValue(fakeTickets)

    await useTicketsStore.getState().getTickets()

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.tickets).toEqual(fakeTickets)
  })

  it('sets error when getTickets fails', async () => {
    vi.mocked(api.getTickets).mockRejectedValue(new Error('fail'))

    await useTicketsStore.getState().getTickets()

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(typeof state.error).toBe('string')
    expect(state.tickets).toEqual([])
  })

  it('fetches a ticket by id with getTicketById (success)', async () => {
    const ticket: Ticket = {
      id: '1',
      subject: 'A',
      customerName: 'Alice',
      description: 'd',
      priority: 'low',
      status: 'new',
      createdAt: '2020-01-01'
    }
    vi.mocked(api.getTicketById).mockResolvedValue(ticket)

    await useTicketsStore.getState().getTicketById('1')

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.currentTicket).toEqual(ticket)
  })

  it('handles missing ticket from apiGetTicketById', async () => {
    vi.mocked(api.getTicketById).mockResolvedValue(undefined)

    await useTicketsStore.getState().getTicketById('notfound')

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.currentTicket).toBeNull()
    expect(typeof state.error).toBe('string')
  })

  it('sets error when getTicketById fails', async () => {
    vi.mocked(api.getTicketById).mockRejectedValue(new Error('boom'))

    await useTicketsStore.getState().getTicketById('1')

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(typeof state.error).toBe('string')
  })

  it('updates ticket status and currentTicket on updateTicketStatus (success)', async () => {
    // seed store with tickets and currentTicket
    useTicketsStore.setState({
      tickets: [
        {
          id: '1',
          subject: 'A',
          customerName: 'Alice',
          description: 'd',
          status: 'new',
          priority: 'low',
          createdAt: '2020-01-01'
        } as Ticket
      ] as Ticket[],
      currentTicket: {
        id: '1',
        subject: 'A',
        customerName: 'Alice',
        description: 'd',
        status: 'new',
        priority: 'low',
        createdAt: '2020-01-01'
      } as Ticket
    })
    vi.mocked(api.updateTicketStatus).mockResolvedValue(undefined)

    await useTicketsStore.getState().updateTicketStatus('1', 'in_progress' as Ticket['status'])

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.tickets.find(t => t.id === '1')?.status).toBe('in_progress')
    expect(state.currentTicket?.status).toBe('in_progress')
  })

  it('sets error when updateTicketStatus fails', async () => {
    useTicketsStore.setState({
      tickets: [
        {
          id: '1',
          subject: 'A',
          customerName: 'Alice',
          description: 'd',
          status: 'new',
          priority: 'low',
          createdAt: '2020-01-01'
        } as Ticket
      ] as Ticket[],
      currentTicket: {
        id: '1',
        subject: 'A',
        customerName: 'Alice',
        description: 'd',
        status: 'new',
        priority: 'low',
        createdAt: '2020-01-01'
      } as Ticket
    })
    vi.mocked(api.updateTicketStatus).mockRejectedValue(new Error('update-fail'))

    await useTicketsStore.getState().updateTicketStatus('1', 'closed' as Ticket['status'])

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(typeof state.error).toBe('string')
  })
})
