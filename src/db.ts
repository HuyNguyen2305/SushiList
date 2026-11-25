import Dexie, { type EntityTable } from 'dexie'
import type { Task } from './data'

export const db = new Dexie('sushibar') as Dexie & { tasks: EntityTable<Task, 'id'> }

// Bump the version and add .upgrade() when fields change, so old data keeps working.
db.version(1).stores({ tasks: 'id, status, beltOrder, dayKey' })
