import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Prepare mocks before importing the component under test
const getTicketsMock = vi.fn()

vi.mock('@/stores/useTicketsStore', () => ({
  useTicketsStore: vi.fn()
}))

vi.mock('@/components/Loader', () => ({
  default: () => <div data-testid="loader">LOADING</div>
}))

vi.mock('@/components/ErrorMessage', () => ({
  default: ({ error }: { error: unknown }) => <div data-testid="error">{String(error)}</div>
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k })
}))

const navigateMock = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock
}))

import { useTicketsStore } from '@/stores/useTicketsStore'
import TicketsTable from './TicketsTable'

describe('TicketsTable', () => {
  beforeEach(() => {
    getTicketsMock.mockReset()
    navigateMock.mockReset()
  })

  it('shows loader when loading and calls getTickets', async () => {
    ;(useTicketsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      tickets: [],
      loading: true,
      error: null,
      getTickets: getTicketsMock,
      filterTicketsByStatus: (status: string) => {
        void status
        return []
      }
    }))

    render(<TicketsTable />)

    await waitFor(() => expect(screen.getByTestId('loader')).toBeInTheDocument())
    expect(getTicketsMock).toHaveBeenCalled()
  })

  it('shows error when error exists', async () => {
    ;(useTicketsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      tickets: [],
      loading: false,
      error: 'network',
      getTickets: getTicketsMock,
      filterTicketsByStatus: (status: string) => {
        void status
        return []
      }
    }))

    render(<TicketsTable />)
    expect(screen.getByTestId('error')).toHaveTextContent('network')
  })

  it('renders tickets, filters and navigates on row click', async () => {
    const tickets = [
      { id: '1', customerName: 'Alice', subject: 'A', status: 'new', priority: 'low' },
      { id: '2', customerName: 'Bob', subject: 'B', status: 'in_progress', priority: 'high' },
      { id: '3', customerName: 'Carl', subject: 'C', status: 'closed', priority: 'medium' }
    ]

    function filterFn(status: string) {
      return tickets.filter(t => t.status === status)
    }

    ;(useTicketsStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      tickets,
      loading: false,
      error: null,
      getTickets: getTicketsMock,
      filterTicketsByStatus: filterFn
    }))

    render(<TicketsTable />)

    // all rows present initially
    expect(await screen.findByText('A')).toBeInTheDocument()
    const rows = screen.getAllByRole('row')
    // header row + 3 data rows
    expect(rows.length).toBeGreaterThanOrEqual(4)

    // filter to in_progress
    const select = screen.getByRole('combobox', { name: /filterByStatus/i })
    await userEvent.selectOptions(select, 'in_progress')

    // after filtering, only Bob should be present
    expect(screen.queryByText('A')).not.toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()

    // clicking a row should call navigate with correct path
    const bobRow = screen.getByText('B').closest('tr') as HTMLElement
    await userEvent.click(bobRow)
    expect(navigateMock).toHaveBeenCalledWith('/ticket/2')
  })
})
