import ErrorMessage from '@/components/ErrorMessage'
import Loader from '@/components/Loader'
import { useTicketsStore } from '@/stores/useTicketsStore'
import type { Status } from '@/types/Ticket'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function TicketsTable() {
  const { t } = useTranslation()
  const navigate = useNavigate()

const { tickets, loading, error, getTickets, filterTicketsByStatus } =
    useTicketsStore()

  const [filter, setFilter] = useState<Status | 'all'>('all')

  useEffect(() => {
    getTickets()
  }, [getTickets])

  const filtered = filter === 'all' ? tickets : filterTicketsByStatus(filter)

  function handleRowClick(id: string) {
    navigate(`/ticket/${id}`)
  }

  if (loading) return <Loader />

  if (error) {
    return (
      <ErrorMessage error={error} />
    )
  }

  return (
    <div>
      <div className="tickets-filter">
        <div className="select-wrapper">
          <label htmlFor="status-select" className="select-label">
            {t('filterByStatus')}:
          </label>
          <select
            id="status-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="select"
          >
            <option value="new">{t('new')}</option>
            <option value="in_progress">{t('in_progress')}</option>
            <option value="closed">{t('closed')}</option>
            <option value="all">{t('all')}</option>
          </select>
        </div>
      </div>

      <table className="tickets-table">
        <thead>
          <tr>
            <th>
              <strong>{t('id')}</strong>
            </th>
            <th>
              <strong>{t('customerName')}</strong>
            </th>
            <th>
              <strong>{t('subject')}</strong>
            </th>
            <th>
              <strong>{t('status')}</strong>
            </th>
            <th>
              <strong>{t('priority')}</strong>
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((ticket) => (
            <tr
              key={ticket.id}
              className="ticket-row"
              onClick={() => handleRowClick(ticket.id)}
            >
              <td>{ticket.id}</td>
              <td>{ticket.customerName}</td>
              <td>{ticket.subject}</td>
              <td>
                <span className={`badge ${ticket.status}`}>{t(ticket.status)}</span>
              </td>
              <td>{t(ticket.priority)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
