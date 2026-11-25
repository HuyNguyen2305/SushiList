import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import App from './App'

it('adds a plate, edits it, then deletes it with a confirm click', async () => {
  const user = userEvent.setup()
  render(<App />)
  expect(await screen.findByText(/Nothing on the belt/)).toBeInTheDocument()

  await user.type(screen.getByLabelText('Task title'), 'Pay rent')
  await user.click(screen.getByRole('button', { name: 'Order' }))
  expect(await screen.findByRole('button', { name: 'Pick plate: Pay rent' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Edit Pay rent' }))
  const title = within(screen.getByRole('listitem')).getByLabelText('Task title')
  await user.clear(title)
  await user.type(title, 'Pay bills')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(await screen.findByRole('button', { name: 'Pick plate: Pay bills' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Delete Pay bills' }))
  await user.click(screen.getByRole('button', { name: 'Confirm delete Pay bills' }))
  expect(await screen.findByText(/Nothing on the belt/)).toBeInTheDocument()
})
