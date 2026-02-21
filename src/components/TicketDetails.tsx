import ErrorMessage from '@/components/ErrorMessage'
import Loader from '@/components/Loader'
import { useTicketsStore } from '@/stores/useTicketsStore'
import type { Status } from '@/types/Ticket'
import { formatDate } from '@/utils'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

export default function TicketDetails() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status | undefined>(undefined)

  const {
    currentTicket: ticket,
    getTicketById,
    updateTicketStatus,
    loading,
    error
  } = useTicketsStore()

  useEffect(() => {
    if (!id) return
    getTicketById(id)
  }, [id, getTicketById])

  async function handleUpdateTicketStatus(idStr: string) {
    if (!status || status === ticket?.status) return
    await updateTicketStatus(idStr, status)
  }

  if (!ticket || loading) return <Loader />

  if (error) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="ticket-details">
      <header className="ticket-details-header">
        <nav>
          <Link to="/">
            <span className="back-to-list-chevron">{`<<`}</span>
            <span className="back-to-list-text">{t('ticketsList')}</span>
          </Link>
        </nav>
        <div className="ticket-status-dropdown">
          <div className="select-wrapper collapse-on-mobile">
            <label htmlFor="status-select" className="select-label">
              {t('updateTicketStatus')}:
            </label>
            <select
              id="status-select"
              value={status ?? ticket.status}
              onChange={e => setStatus(e.target.value as Status)}
              className="select"
            >
              <option value="new">{t('new')}</option>
              <option value="in_progress">{t('in_progress')}</option>
              <option value="closed">{t('closed')}</option>
            </select>
          </div>
          <button className="btn primary" onClick={() => handleUpdateTicketStatus(ticket.id)}>
            {t('update')}
          </button>
        </div>
      </header>

      <ul className="ticket-details-list">
        <li>
          <strong>{t('id')}</strong>: {ticket.id}
        </li>
        <li>
          <strong>{t('customerName')}</strong>: {ticket.customerName}
        </li>
        <li>
          <strong>{t('subject')}</strong>: {ticket.subject}
        </li>
        <li>
          <strong>{t('status')}</strong>:
          <span className={`badge ${ticket.status}`}>{t(ticket.status)}</span>
        </li>
        <li>
          <strong>{t('priority')}</strong>: {t(ticket.priority)}
        </li>
        <li>
          <strong>{t('createdAt')}</strong>: {formatDate(ticket.createdAt)}
        </li>
      </ul>

      <div className="ticket-description">
        <p>
          <strong>{t('description')}:</strong>
        </p>
        <p>{ticket.description}</p>
      </div>
    </div>
  )
}
