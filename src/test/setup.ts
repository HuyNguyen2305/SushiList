import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { db } from '../db'
import { useStore } from '../store'

afterEach(async () => {
  cleanup()
  await db.tasks.clear()
  useStore.setState({ tasks: [], ready: false, error: null, selectedId: null })
})
