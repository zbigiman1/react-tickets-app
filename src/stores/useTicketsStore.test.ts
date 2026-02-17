import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Create mocked API functions inside the factory so vitest hoisting is safe
vi.mock('@/api', () => ({
  getTickets: vi.fn(),
  getTicketById: vi.fn(),
  updateTicketStatus: vi.fn(),
}))

import * as api from '@/api'
import { useTicketsStore } from './useTicketsStore'

describe('useTicketsStore', () => {
  const initialState = {
    tickets: [] as any[],
    currentTicket: null as any,
    loading: false,
    error: null as string | null,
  }

  beforeEach(() => {
  // reset API mocks
  ;(api.getTickets as any).mockReset()
  ;(api.getTicketById as any).mockReset()
  ;(api.updateTicketStatus as any).mockReset()

    // reset store state
    useTicketsStore.setState({
      tickets: [...initialState.tickets],
      currentTicket: initialState.currentTicket,
      loading: initialState.loading,
      error: initialState.error,
    })

    // suppress console.error output from the store during tests (we assert state instead)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetches tickets successfully with getTickets', async () => {
  const fakeTickets = [{ id: '1', subject: 'A', customerName: 'Alice', description: 'd', priority: 'low', status: 'new', createdAt: '2020-01-01' }]
  ;(api.getTickets as any).mockResolvedValue(fakeTickets)

    await useTicketsStore.getState().getTickets()

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.tickets).toEqual(fakeTickets)
  })

  it('sets error when getTickets fails', async () => {
  ;(api.getTickets as any).mockRejectedValue(new Error('fail'))

    await useTicketsStore.getState().getTickets()

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(typeof state.error).toBe('string')
    expect(state.tickets).toEqual([])
  })

  it('fetches a ticket by id with getTicketById (success)', async () => {
  const ticket = { id: '1', subject: 'A', customerName: 'Alice', description: 'd', priority: 'low', status: 'new', createdAt: '2020-01-01' }
  ;(api.getTicketById as any).mockResolvedValue(ticket)

    await useTicketsStore.getState().getTicketById('1')

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.currentTicket).toEqual(ticket)
  })

  it('handles missing ticket from apiGetTicketById', async () => {
  ;(api.getTicketById as any).mockResolvedValue(undefined)

    await useTicketsStore.getState().getTicketById('notfound')

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.currentTicket).toBeNull()
    expect(typeof state.error).toBe('string')
  })

  it('sets error when getTicketById fails', async () => {
  ;(api.getTicketById as any).mockRejectedValue(new Error('boom'))

    await useTicketsStore.getState().getTicketById('1')

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(typeof state.error).toBe('string')
  })

  it('updates ticket status and currentTicket on updateTicketStatus (success)', async () => {
    // seed store with tickets and currentTicket
    useTicketsStore.setState({
      tickets: [
        { id: '1', subject: 'A', customerName: 'Alice', description: 'd', status: 'new', priority: 'low', createdAt: '2020-01-01' },
      ],
      currentTicket: { id: '1', subject: 'A', customerName: 'Alice', description: 'd', status: 'new', priority: 'low', createdAt: '2020-01-01' },
    })

  ;(api.updateTicketStatus as any).mockResolvedValue(undefined)

    await useTicketsStore.getState().updateTicketStatus('1', 'in_progress' as any)

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.tickets.find((t) => t.id === '1')?.status).toBe('in_progress')
    expect(state.currentTicket?.status).toBe('in_progress')
  })

  it('sets error when updateTicketStatus fails', async () => {
    useTicketsStore.setState({
      tickets: [{ id: '1', subject: 'A', customerName: 'Alice', description: 'd', status: 'new', priority: 'low', createdAt: '2020-01-01' }],
      currentTicket: { id: '1', subject: 'A', customerName: 'Alice', description: 'd', status: 'new', priority: 'low', createdAt: '2020-01-01' },
    })

  ;(api.updateTicketStatus as any).mockRejectedValue(new Error('update-fail'))

    await useTicketsStore.getState().updateTicketStatus('1', 'closed' as any)

    const state = useTicketsStore.getState()
    expect(state.loading).toBe(false)
    expect(typeof state.error).toBe('string')
  })
})
