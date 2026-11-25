import Dexie, { type EntityTable } from 'dexie'
import type { Task } from './data'

export type MetaRow = { key: string; value: unknown }

export const db = new Dexie('sushibar') as Dexie & {
  tasks: EntityTable<Task, 'id'>
  meta: EntityTable<MetaRow, 'key'>
}

// Bump the version and add .upgrade() when fields change, so old data keeps working.
db.version(1).stores({ tasks: 'id, status, beltOrder, dayKey' })
db.version(2).stores({ tasks: 'id, status, beltOrder, dayKey', meta: 'key' })
