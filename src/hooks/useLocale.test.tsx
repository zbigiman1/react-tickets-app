import useLocale from '@/hooks/useLocale'
import { fireEvent, render, screen } from '@testing-library/react'
import type { i18n } from 'i18next'
import { beforeEach, describe, expect, it, vi } from 'vitest'
function TestComponent({ i18n }: { i18n: i18n | null | undefined }) {
  const { locale, setLocale } = useLocale(i18n ?? null)
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button data-testid="set-pl" onClick={() => setLocale('pl')}>
        set-pl
      </button>
      <button data-testid="set-en" onClick={() => setLocale('en')}>
        set-en
      </button>
    </div>
  )
}

describe('useLocale', () => {
  beforeEach(() => {
    // ensure a clean storage for each test
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('reads initial locale from localStorage and calls i18n.changeLanguage', () => {
    localStorage.setItem('i18nextLng', 'pl')
    const changeLanguage = vi.fn()
    const i18n = { changeLanguage } as unknown as i18n

    render(<TestComponent i18n={i18n} />)

    expect(screen.getByTestId('locale').textContent).toBe('pl')
    expect(changeLanguage).toHaveBeenCalledWith('pl')
  })

  it('updates locale when setLocale is called, writes to localStorage and calls changeLanguage', () => {
    const changeLanguage = vi.fn()
    const i18n = { changeLanguage } as unknown as i18n

    render(<TestComponent i18n={i18n} />)

    // default should be 'en' when storage is empty
    expect(screen.getByTestId('locale').textContent).toBe('en')

    fireEvent.click(screen.getByTestId('set-pl'))

    expect(screen.getByTestId('locale').textContent).toBe('pl')
    expect(changeLanguage).toHaveBeenCalledWith('pl')
    expect(localStorage.getItem('i18nextLng')).toBe('pl')
  })

  it('does not call i18n.changeLanguage when i18n is null but still updates localStorage', () => {
    render(<TestComponent i18n={null} />)

    expect(screen.getByTestId('locale').textContent).toBe('en')

    // spy on a missing changeLanguage should not throw; ensure no global errors
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    fireEvent.click(screen.getByTestId('set-pl'))

    expect(screen.getByTestId('locale').textContent).toBe('pl')
    expect(localStorage.getItem('i18nextLng')).toBe('pl')

    spy.mockRestore()
  })
})
