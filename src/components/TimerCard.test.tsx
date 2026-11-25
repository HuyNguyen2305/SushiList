import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { TimerCard } from './TimerCard'

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})
afterEach(() => vi.useRealTimers())

const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms))

it('counts down from the chosen minutes, pauses, resumes and rings at zero', () => {
  render(<TimerCard />)
  for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole('button', { name: '5 minutes less' })) // 25 -> 5
  expect(screen.getByRole('timer')).toHaveTextContent('05:00')

  fireEvent.click(screen.getByRole('button', { name: 'Start' }))
  tick(65_000)
  expect(screen.getByRole('timer')).toHaveTextContent('03:55')

  fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
  tick(60_000)
  expect(screen.getByRole('timer')).toHaveTextContent('03:55') // paused: the clock holds

  fireEvent.click(screen.getByRole('button', { name: 'Resume' }))
  tick(235_000)
  expect(screen.getByText('Time is up!')).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Reset timer' }))
  expect(screen.getByRole('timer')).toHaveTextContent('05:00')
})

it('a running timer survives a reload and keeps the real time', () => {
  const { unmount } = render(<TimerCard />)
  fireEvent.click(screen.getByRole('button', { name: 'Start' }))
  tick(10_000)
  unmount()
  vi.setSystemTime(Date.now() + 20_000) // 20 s pass while the page is closed
  render(<TimerCard />)
  expect(screen.getByRole('timer')).toHaveTextContent('24:30')
})
