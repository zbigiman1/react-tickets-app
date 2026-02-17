import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mocks must be registered before importing the component under test
const updateTicketMock = vi.fn().mockResolvedValue(undefined)
const getTicketMock = vi.fn().mockResolvedValue(undefined)

vi.mock('@/stores/useTicketsStore', () => ({
  useTicketsStore: vi.fn(),
}))

vi.mock('@/components/Loader', () => ({
  default: () => <div data-testid="loader">LOADING</div>,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}))

vi.mock('@/utils', () => ({ formatDate: (d: string) => `formatted:${d}` }))

import { useTicketsStore } from '@/stores/useTicketsStore'
import TicketDetails from './TicketDetails'

describe('TicketDetails', () => {
  beforeEach(() => {
    updateTicketMock.mockReset()
    getTicketMock.mockReset()
  })

  it('shows loader when loading', async () => {
    ;(useTicketsStore as any).mockImplementation(() => ({
      currentTicket: undefined,
      getTicketById: getTicketMock,
      updateTicketStatus: updateTicketMock,
      loading: true,
      error: null,
    }))

    render(<TicketDetails />)

    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument())
  })

  it('shows error message when error exists', async () => {
    (useTicketsStore as any).mockImplementation(() => ({
      currentTicket: {
        id: '1',
        customerName: '',
        subject: '',
        description: '',
        priority: 'low',
        status: 'new',
        createdAt: '',
      },
      getTicketById: getTicketMock,
      updateTicketStatus: updateTicketMock,
      loading: false,
      error: 'oops',
    }))

    render(<TicketDetails />)
    expect(screen.getByText(/oops/)).toBeInTheDocument()
  })

  it('renders ticket details and allows status update', async () => {
    const ticket = {
      id: '1',
      customerName: 'Alice',
      subject: 'Help',
      description: 'Desc',
      priority: 'low',
      status: 'new',
      createdAt: '2020-01-01',
    }

    ;(useTicketsStore as any).mockImplementation(() => ({
      currentTicket: ticket,
      getTicketById: getTicketMock,
      updateTicketStatus: updateTicketMock,
      loading: false,
      error: null,
    }))

    render(<TicketDetails />)

    await waitFor(() => expect(screen.getByText(/Help/)).toBeInTheDocument())

    const select = screen.getByRole('combobox', { name: /updateTicketStatus/i }) as HTMLSelectElement
    await userEvent.selectOptions(select, 'in_progress')

    const updateBtn = screen.getByText('update')
    await userEvent.click(updateBtn)

    await waitFor(() => expect(updateTicketMock).toHaveBeenCalledWith('1', 'in_progress'))
  })
})
