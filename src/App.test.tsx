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
  expect(screen.queryByText(/null/)).not.toBeInTheDocument() // folded-away fields must not save as "null"

  await user.click(screen.getByRole('button', { name: 'Edit Pay rent' }))
  const title = within(screen.getByRole('listitem')).getByLabelText('Task title')
  await user.clear(title)
  await user.type(title, 'Pay bills')
  await user.click(screen.getByRole('button', { name: 'Save' }))
  expect(await screen.findByRole('button', { name: 'Pick plate: Pay bills' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Delete Pay bills' }))
  expect(await screen.findByText(/Nothing on the belt/)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Undo' })) // deleting is undoable for 5 seconds
  expect(await screen.findByRole('button', { name: 'Pick plate: Pay bills' })).toBeInTheDocument()
})

it('eating a plate moves it to the stack, and Undo puts it back on the belt', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.type(await screen.findByLabelText('Task title'), 'Pay rent')
  await user.click(screen.getByRole('button', { name: 'Order' }))
  expect((await screen.findAllByText('0 of 1 eaten')).length).toBeGreaterThan(0)

  await user.click(screen.getByRole('button', { name: 'Eat Pay rent' }))
  expect((await screen.findAllByText('1 of 1 eaten')).length).toBeGreaterThan(0)
  expect(screen.queryByRole('button', { name: 'Pick plate: Pay rent' })).not.toBeInTheDocument()
  expect(screen.getByText(/Ate/)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: "Today's plates" }))
  expect(screen.getByText('Pay rent', { selector: 'li span' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Undo' }))
  expect((await screen.findAllByText('0 of 1 eaten')).length).toBeGreaterThan(0)
  expect(screen.getByRole('button', { name: 'Pick plate: Pay rent' })).toBeInTheDocument()
})
