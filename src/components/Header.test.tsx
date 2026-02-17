import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// prepare a stable mock that the factories will close over
const setLocaleMock = vi.fn()

// Provide factory mocks so the imported hooks return deterministic implementations
vi.mock('@/hooks/useLocale', () => ({
  default: () => ({ locale: 'en', setLocale: setLocaleMock }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => (key === 'title' ? 'Test Title' : key),
    i18n: { changeLanguage: vi.fn() },
  }),
}))

import Header from './Header'

describe('Header', () => {
  beforeEach(() => {
    setLocaleMock.mockClear()
  })

  it('renders title from translation', () => {
    render(<Header />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('calls setLocale when language buttons are clicked and shows active class', () => {
    render(<Header />)

    const enButton = screen.getByText('EN')
    const plButton = screen.getByText('PL')

    // EN should have active class because the mocked hook returns locale 'en'
    expect(enButton.classList.contains('active')).toBe(true)
    expect(plButton.classList.contains('active')).toBe(false)

    fireEvent.click(plButton)
    expect(setLocaleMock).toHaveBeenCalledWith('pl')

    fireEvent.click(enButton)
    expect(setLocaleMock).toHaveBeenCalledWith('en')
  })
})
